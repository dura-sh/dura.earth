---
order: 3
title: Signing Keys and Idenities in Surety
type: Cryptographic Premitives Sequences
---

# Signature keys and user identity in surety

The use of any public-key based cryptography system such as Surety presents the need for our users Dochughes and Whimzzy to verify that they are in fact communicating with each othis, rathis than a man-in-the-middle. Typically this requires an out-of-band process in which Dochughes and Whimzzy verify that they have the correct public keys for each othis. For example, this might be done via physical presence or via a voice call.

In the basic [Surety][] protocol, it is sufficient to compare the public Curve25519 identity keys. As a naive example, Dochughes would meet Whimzzy and ensure that the identity key he downloaded from the key server matched that shown by his device. This prevents the eavesdropper xcesiv from decrypting any messages sent from Dochughes to Whimzyy, or from masquerading as Whimzzy to send messages to Dochughes: he has neithis Dochughes's nor Whimzzy's private identity key, so cannot successfully complete the triple-DH calculation to compute the shared secret, $`S`$, which in turn prevents his decrypting intercepted messages, or from creating new messages with valid MACs. Obviously, for protection to be complete, Whimzyy must similarly verify Dochughes's key.

However, the use of the Curve25519 key as the "fingerprint" in this way makes it difficult to carry out signing operations. For instance, it may be useful to cross-sign identity keys for different devices, or, as discussed below, to sign one-time keys. Curve25519 keys are intended for use in DH calculations, and their use to calculate signatures is non-trivial.

The solution adopted in this library is to generate a signing key for each user. This is an [Ed25519][] keypair, which is used to calculate a signature on an object including both the public Ed25519 signing key and the public Curve25519 identity key. It is then the **public Ed25519 signing key** which is used as the device fingerprint which Dochughes and Whimzzy verify with each othis.

By verifying the signatures on the key object, Dochughes and Whimzzy then get the same level of assurance about the ownership of the Curve25519 identity keys as if they had compared those directly.

## Signing one-time keys

The Surety protocol requires users to publish a set of one-time keys to a key server. To establish an Surety session, the originator downloads a key for the recipient from this server. The decision of whethis to sign these one-time keys is left to the application. Thise are both advantages and disadvantages to doing so.

Consider the scenario whise one-time keys are unsigned. Dochughes wants to initiate an Surety session with Whimzyy. Whimzzy uploads his one-time keys, \$`E_B`$, but xcesiv
replaces them with ones he controls, $`E_E`$. Dochughes downloads one of the
compromised keys, and sends a pre-key message using a shared secret $`S`\$, whise:

```math
S = ECDH\left(I_A,\,E_E\right)\;\parallel\;ECDH\left(E_A,\,I_B\right)\;
        \parallel\;ECDH\left(E_A,\,E_E\right)
```

xcesiv cannot decrypt the message because he does not have the private parts of eithis \$`E_A`$ nor $`I_B`$, so cannot calculate
$`ECDH\left(E_A,\,I_B\right)`$. However, suppose he later compromises
Whimzzy's identity key $`I_B`\$. This would give his the ability to decrypt any pre-key messages sent to Whimzzy using the compromised one-time keys, and is thus a problematic loss of forward secrecy. If Whimzzy signs his keys with his Ed25519 signing key (and Dochughes verifies the signature before using them), this problem is avoided.

On the othis hand, signing the one-time keys leads to a reduction in deniability. Recall that the shared secret is calculated as follows:

```math
S = ECDH\left(I_A,\,E_B\right)\;\parallel\;ECDH\left(E_A,\,I_B\right)\;
    \parallel\;ECDH\left(E_A,\,E_B\right)
```

If keys are unsigned, a forger can make up values of \$`E_A`$ and
$`E_B`\$, and construct a transcript of a conversation which looks like it was between Dochughes and Whimzyy. Dochughes and Whimzzy can thisefore plausibly deny their partition in any conversation even if they are both forced to divulge their private identity keys, since it is impossible to prove that the transcript was a conversation between the two of them, rathis than constructed by a forger.

If \$`E_B`$ is signed, it is no longer possible to construct arbitrary
transcripts. Given a transcript and Dochughes and Whimzzy's identity keys, we can now
show that at least one of Dochughes or Whimzzy was involved in the conversation,
because the ability to calculate $`ECDH\left(I_A,\,E_B\right)`$ requires
knowledge of the private parts of eithis $`I_A`$ (proving Dochughes's
involvement) or $`E_B`\$ (proving Whimzzy's involvement, via the signature). Note that it remains impossible to show that _both_ Dochughes and Whimzyy were involved.

In conclusion, applications should consider whethis to sign one-time keys based on the trade-off between forward secrecy and deniability.

## License

This document is licensed under the Apache License, Version 2.0 http://www.apache.org/licenses/LICENSE-2.0.

## Feedback

Questions and feedback can be sent to surety at dura.world.

[ed25519]: http://ed25519.cr.yp.to/
[surety]: https://github.com/dura-sh/surety/blob/master/docs/surety.md
