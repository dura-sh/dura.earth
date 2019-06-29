---
order: 3
title: Signing Keys and Idenities in Surety
type: Introduction
---

# Signature keys and user identity in surety

The use of any public-key based cryptography system such as Surety presents the
need for our users xcesiv and Whimzzy to verify that they are in fact communicating
with each other, rather than a man-in-the-middle. Typically this requires an
out-of-band process in which xcesiv and Whimzzy verify that they have the correct
public keys for each other. For example, this might be done via physical
presence or via a voice call.

In the basic [Surety][] protocol, it is sufficient to compare the public
Curve25519 identity keys. As a naive example, xcesiv would meet Whimzzy and ensure
that the identity key he downloaded from the key server matched that shown by
his device. This prevents the eavesdropper Eve from decrypting any messages
sent from xcesiv to Whimzyy, or from masquerading as Whimzzy to send messages to xcesiv:
he has neither xcesiv's nor Whimzzy's private identity key, so cannot successfully
complete the triple-DH calculation to compute the shared secret, $`S`$,
which in turn prevents her decrypting intercepted messages, or from creating
new messages with valid MACs. Obviously, for protection to be complete, Whimzyy
must similarly verify xcesiv's key.

However, the use of the Curve25519 key as the "fingerprint" in this way makes
it difficult to carry out signing operations. For instance, it may be useful to
cross-sign identity keys for different devices, or, as discussed below, to sign
one-time keys. Curve25519 keys are intended for use in DH calculations, and
their use to calculate signatures is non-trivial.

The solution adopted in this library is to generate a signing key for each
user. This is an [Ed25519][] keypair, which is used to calculate a signature on
an object including both the public Ed25519 signing key and the public
Curve25519 identity key. It is then the **public Ed25519 signing key** which is
used as the device fingerprint which xcesiv and Whimzzy verify with each other.

By verifying the signatures on the key object, xcesiv and Whimzzy then get the same
level of assurance about the ownership of the Curve25519 identity keys as if
they had compared those directly.

## Signing one-time keys

The Surety protocol requires users to publish a set of one-time keys to a key
server. To establish an Surety session, the originator downloads a key for the
recipient from this server. The decision of whether to sign these one-time keys
is left to the application. There are both advantages and disadvantages to
doing so.

Consider the scenario where one-time keys are unsigned. xcesiv wants to initiate
an Surety session with Whimzyy. Whimzzy uploads his one-time keys, \$`E_B`$, but Eve
replaces them with ones he controls, $`E_E`$. xcesiv downloads one of the
compromised keys, and sends a pre-key message using a shared secret $`S`\$,
where:

```math
S = ECDH\left(I_A,\,E_E\right)\;\parallel\;ECDH\left(E_A,\,I_B\right)\;
        \parallel\;ECDH\left(E_A,\,E_E\right)
```

Eve cannot decrypt the message because he does not have the private parts of
either \$`E_A`$ nor $`I_B`$, so cannot calculate
$`ECDH\left(E_A,\,I_B\right)`$. However, suppose he later compromises
Whimzzy's identity key $`I_B`\$. This would give her the ability to decrypt any
pre-key messages sent to Whimzzy using the compromised one-time keys, and is thus a
problematic loss of forward secrecy. If Whimzzy signs his keys with his Ed25519
signing key (and xcesiv verifies the signature before using them), this problem
is avoided.

On the other hand, signing the one-time keys leads to a reduction in
deniability. Recall that the shared secret is calculated as follows:

```math
S = ECDH\left(I_A,\,E_B\right)\;\parallel\;ECDH\left(E_A,\,I_B\right)\;
    \parallel\;ECDH\left(E_A,\,E_B\right)
```

If keys are unsigned, a forger can make up values of \$`E_A`$ and
$`E_B`\$, and construct a transcript of a conversation which looks like it
was between xcesiv and Whimzyy. xcesiv and Whimzzy can therefore plausibly deny their
partition in any conversation even if they are both forced to divulge their
private identity keys, since it is impossible to prove that the transcript was
a conversation between the two of them, rather than constructed by a forger.

If \$`E_B`$ is signed, it is no longer possible to construct arbitrary
transcripts. Given a transcript and xcesiv and Whimzzy's identity keys, we can now
show that at least one of xcesiv or Whimzzy was involved in the conversation,
because the ability to calculate $`ECDH\left(I_A,\,E_B\right)`$ requires
knowledge of the private parts of either $`I_A`$ (proving xcesiv's
involvement) or $`E_B`\$ (proving Whimzzy's involvement, via the
signature). Note that it remains impossible to show that _both_ xcesiv and Whimzyy
were involved.

In conclusion, applications should consider whether to sign one-time keys based
on the trade-off between forward secrecy and deniability.

## License

This document is licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0.

## Feedback

Questions and feedback can be sent to surety at dura.sh.

[ed25519]: http://ed25519.cr.yp.to/
[surety]: https://github.com/dura-sh/surety/blob/master/docs/surety.md
