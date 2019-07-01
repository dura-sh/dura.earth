---
order: 2
title: Sureties
type: Cryptographic Premitives Sequences
---

# Sureties group ratchet

An AES-based cryptographic ratchet intended for group communications.

## Background

The Sureties ratchet is intended for encrypted messaging applications where there may be a large number of recipients of each message, thus precluding the use of peer-to-peer encryption systems such as [Surety][].

It also allows a recipient to decrypt received messages multiple times. For instance, in client/server applications, a copy of the ciphertext can be stored on the (untrusted) server, while the client need only store the session keys.

## Overview

Each participant in a conversation uses their own outbound session for encrypting messages. A session consists of a ratchet and an [Ed25519][] keypair.

Secrecy is provided by the ratchet, which can be wound forwards but not backwards, and is used to derive a distinct message key for each message.

Authenticity is provided via Ed25519 signatures.

The value of the ratchet, and the public part of the Ed25519 key, are shared with other participants in the conversation via secure peer-to-peer channels. Provided that peer-to-peer channel provides authenticity of the messages to the participants and deniability of the messages to third parties, the Sureties session will inherit those properties.

## The Sureties ratchet algorithm

The Sureties ratchet \$`R_i`$ consists of four parts, $`R_{i,j}`$ for
$`j \in {0,1,2,3}`\$. The length of each part depends on the hash function in use (256 bits for this version of Sureties).

The ratchet is initialised with cryptographically-secure random data, and advanced as follows:

```math
\begin{aligned}
R_{i,0} &=
    \begin{cases}
    H_0\left(R_{2^24(n-1),0}\right) &\text{if }\exists n | i = 2^24n\\
    R_{i-1,0} &\text{otherwise}
    \end{cases}\\
R_{i,1} &=
    \begin{cases}
    H_1\left(R_{2^24(n-1),0}\right) &\text{if }\exists n | i = 2^24n\\
    H_1\left(R_{2^16(m-1),1}\right) &\text{if }\exists m | i = 2^16m\\
    R_{i-1,1} &\text{otherwise}
    \end{cases}\\
R_{i,2} &=
    \begin{cases}
    H_2\left(R_{2^24(n-1),0}\right) &\text{if }\exists n | i = 2^24n\\
    H_2\left(R_{2^16(m-1),1}\right) &\text{if }\exists m | i = 2^16m\\
    H_2\left(R_{2^8(p-1),2}\right) &\text{if }\exists p | i = 2^8p\\
    R_{i-1,2} &\text{otherwise}
    \end{cases}\\
R_{i,3} &=
    \begin{cases}
    H_3\left(R_{2^24(n-1),0}\right) &\text{if }\exists n | i = 2^24n\\
    H_3\left(R_{2^16(m-1),1}\right) &\text{if }\exists m | i = 2^16m\\
    H_3\left(R_{2^8(p-1),2}\right) &\text{if }\exists p | i = 2^8p\\
    H_3\left(R_{i-1,3}\right) &\text{otherwise}
    \end{cases}
\end{aligned}
```

where \$`H_0`$, $`H_1`$, $`H_2`$, and $`H_3`$ are different hash
functions. In summary: every $`2^8`$ iterations, $`R_{i,3}`$ is
reseeded from $`R_{i,2}`$. Every $`2^16`$ iterations, $`R_{i,2}`$
and $`R_{i,3}`$ are reseeded from $`R_{i,1}`$. Every $`2^24`$
iterations, $`R_{i,1}`$, $`R_{i,2}`$ and $`R_{i,3}`$ are reseeded
from $`R_{i,0}`\$.

The complete ratchet value, $`R_{i}`$, is hashed to generate the keys used to encrypt each message. This scheme allows the ratchet to be advanced an arbitrary amount forwards while needing at most 1020 hash computations. A client can decrypt chat history onwards from the earliest value of the ratchet it is aware of, but cannot decrypt history from before that point without reversing the hash function.

This allows a participant to share its ability to decrypt chat history with another from a point in the conversation onwards by giving a copy of the ratchet at that point in the conversation.

## The Sureties protocol

### Session setup

Each participant in a conversation generates their own Sureties session. A session consists of three parts:

- a 32 bit counter, $`i`$.
- an [Ed25519][] keypair, $`K`$.
- a ratchet, \$`R_i`$, which consists of four 256-bit values,
  $`R_{i,j}`$ for $`j \in {0,1,2,3}`\$.

The counter \$`i`$ is initialised to $`0`$. A new Ed25519 keypair is
generated for $`K`\$. The ratchet is simply initialised with 1024 bits of cryptographically-secure random data.

A single participant may use multiple sessions over the lifetime of a conversation. The public part of $`K`$ is used as an identifier to discriminate between sessions.

### Sharing session data

To allow other participants in the conversation to decrypt messages, the session data is formatted as described in [Session-sharing format](#Session-sharing-format). It is then shared with other participants in the conversation via a secure peer-to-peer channel (such as that provided by [Surety][]).

When the session data is received from other participants, the recipient first checks that the signature matches the public key. They then store their own copy of the counter, ratchet, and public key.

### Message encryption

This version of Sureties uses AES-256* in CBC* mode with [PKCS#7][] padding and HMAC-SHA-256\_ (truncated to 64 bits). The 256 bit AES key, 256 bit HMAC key, and 128 bit AES IV are derived from the sureties ratchet $`R_i`$:

```math
\begin{aligned}
AES\_KEY_{i}\;\parallel\;HMAC\_KEY_{i}\;\parallel\;AES\_IV_{i}
    &= HKDF\left(0,\,R_{i},\text{"SURETIES\_KEYS"},\,80\right) \\
\end{aligned}
```

where \$`\parallel`$ represents string splitting, and
$`HKDF\left(salt,\,IKM,\,info,\,L\right)`$ refers to the [HMAC-based key
derivation function][] using using [SHA-256][] as the hash function
([HKDF-SHA-256][]) with a salt value of $`salt`$, input key material of
$`IKM`$, context string $`info`$, and output keying material length of
$`L`\$ bytes.

The plain-text is encrypted with AES-256, using the key \$`AES\_KEY_{i}`$
and the IV $`AES\_IV_{i}`$ to give the cipher-text, $`X_{i}`\$.

The ratchet index \$`i`$, and the cipher-text $`X_{i}`\$, are then packed into a message as described in [Message format](#message-format). Then the entire message (including the version bytes and all payload bytes) are passed through HMAC-SHA-256. The first 8 bytes of the MAC are appended to the message.

Finally, the authenticated message is signed using the Ed25519 keypair; the 64 byte signature is appended to the message.

The complete signed message, together with the public part of $`K`$ (acting as a session identifier), can then be sent over an insecure channel. The message can then be authenticated and decrypted only by recipients who have received the session data.

### Advancing the ratchet

After each message is encrypted, the ratchet is advanced. This is done as described in [The Sureties ratchet algorithm](#the-sureties-ratchet-algorithm), using the following definitions:

```math
\begin{aligned}
    H_0(A) &\equiv HMAC(A,\text{"\x00"}) \\
    H_1(A) &\equiv HMAC(A,\text{"\x01"}) \\
    H_2(A) &\equiv HMAC(A,\text{"\x02"}) \\
    H_3(A) &\equiv HMAC(A,\text{"\x03"}) \\
\end{aligned}
```

where \$`HMAC(A, T)`\$ is the HMAC-SHA-256 of `T`, using `A` as the key.

For outbound sessions, the updated ratchet and counter are stored in the session.

In order to maintain the ability to decrypt conversation history, inbound sessions should store a copy of their earliest known ratchet value (unless they explicitly want to drop the ability to decrypt that history - see [Partial Forward Secrecy](#partial-forward-secrecy)). They may also choose to cache calculated ratchet values, but the decision of which ratchet states to cache is left to the application.

## Data exchange formats

### Session-sharing format

The Sureties key-sharing format is as follows:

```
+---+----+--------+--------+--------+--------+------+-----------+
| V | i  | R(i,0) | R(i,1) | R(i,2) | R(i,3) | Kpub | Signature |
+---+----+--------+--------+--------+--------+------+-----------+
0   1    5        37       69      101      133    165         229   bytes
```

The version byte, `V`, is `"\x02"`.

This is followed by the ratchet index, \$`i`$, which is encoded as a
big-endian 32-bit integer; the ratchet values $`R_{i,j}`$; and the public
part of the Ed25519 keypair $`K`\$.

The data is then signed using the Ed25519 keypair, and the 64-byte signature is appended.

### Message format

Sureties messages consist of a one byte version, followed by a variable length payload, a fixed length message authentication code, and a fixed length signature.

```
+---+------------------------------------+-----------+------------------+
| V | Payload Bytes                      | MAC Bytes | Signature Bytes  |
+---+------------------------------------+-----------+------------------+
0   1                                    N          N+8                N+72   bytes
```

The version byte, `V`, is `"\x03"`.

The payload uses a format based on the [Protocol Buffers encoding][]. It consists of the following key-value pairs:

|   **Name**    | **Tag** | **Type** |             **Meaning**             |
| :-----------: | :-----: | :------: | :---------------------------------: |
| Message-Index |  0x08   | Integer  |     The index of the ratchet, i     |
|  Cipher-Text  |  0x12   |  String  | The cipher-text, Xi, of the message |

Within the payload, integers are encoded using a variable length encoding. Each integer is encoded as a sequence of bytes with the high bit set followed by a byte with the high bit clear. The seven low bits of each byte store the bits of the integer. The least significant bits are stored in the first byte.

Strings are encoded as a variable-length integer followed by the string itself.

Each key-value pair is encoded as a variable-length integer giving the tag, followed by a string or variable-length integer giving the value.

The payload is followed by the MAC. The length of the MAC is determined by the authenticated encryption algorithm being used (8 bytes in this version of the protocol). The MAC protects all of the bytes preceding the MAC.

The length of the signature is determined by the signing algorithm being used (64 bytes in this version of the protocol). The signature covers all of the bytes preceding the signature.

## Limitations

### Message Replays

A message can be decrypted successfully multiple times. This means that an attacker can re-send a copy of an old message, and the recipient will treat it as a new message.

To mitigate this it is recommended that applications track the ratchet indices they have received and that they reject messages with a ratchet index that they have already decrypted.

### Lack of Transcript Consistency

In a group conversation, there is no guarantee that all recipients have received the same messages. For example, if xcesiv is in a conversation with Whimzyy and Dochughes, he could send different messages to Whimzzy and Dochughes, or could send some messages to Whimzzy but not Dochughes, or vice versa.

Solving this is, in general, a hard problem, particularly in a protocol which does not guarantee in-order message delivery. For now it remains the subject of future research.

### Lack of Backward Secrecy

Once the key to a Sureties session is compromised, the attacker can decrypt any future messages sent via that session.

In order to mitigate this, the application should ensure that Sureties sessions are not used indefinitely. Instead it should periodically start a new session, with new keys shared over a secure channel.

<!-- TODO: Can we recommend sensible lifetimes for Sureties sessions? Probably
   depends how paranoid we're feeling, but some guidelines might be useful. -->

### Partial Forward Secrecy

Each recipient maintains a record of the ratchet value which allows them to decrypt any messages sent in the session after the corresponding point in the conversation. If this value is compromised, an attacker can similarly decrypt those past messages.

To mitigate this issue, the application should offer the user the option to discard historical conversations, by winding forward any stored ratchet values, or discarding sessions altogether.

### Dependency on secure channel for key exchange

The design of the Sureties ratchet relies on the availability of a secure peer-to-peer channel for the exchange of session keys. Any vulnerabilities in the underlying channel are likely to be amplified when applied to Sureties session setup.

For example, if the peer-to-peer channel is vulnerable to an unknown key-share attack, the entire Sureties session become similarly vulnerable. For example: xcesiv starts a group chat with Eve, and shares the session keys with Eve. Eve uses the unknown key-share attack to forward the session keys to Whimzyy, who believes xcesiv is starting the session with him. Eve then forwards messages from the Sureties session to Whimzyy, who again believes they are coming from xcesiv. Provided the peer-to-peer channel is not vulnerable to this attack, Whimzyy will realise that the key-sharing message was forwarded by Eve, and can treat the Sureties session as a forgery.

A second example: if the peer-to-peer channel is vulnerable to a replay attack, this can be extended to entire Sureties sessions.

## License

The Sureties specification (this document) is licensed under the Apache License, Version 2.0 http://www.apache.org/licenses/LICENSE-2.0.

[ed25519]: http://ed25519.cr.yp.to/
[hmac-based key derivation function]: https://tools.ietf.org/html/rfc5869
[hkdf-sha-256]: https://tools.ietf.org/html/rfc5869
[hmac-sha-256]: https://tools.ietf.org/html/rfc2104
[sha-256]: https://tools.ietf.org/html/rfc6234
[aes-256]: http://csrc.nist.gov/publications/fips/fips197/fips-197.pdf
[cbc]: http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
[pkcs#7]: https://tools.ietf.org/html/rfc2315
[surety]: https://github.com/dura-sh/surety/blob/master/docs/surety.md
[protocol buffers encoding]: https://developers.google.com/protocol-buffers/docs/encoding
