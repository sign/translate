Videos:

- https://www.youtube.com/watch?v=L95mA_h0CjA
- https://www.youtube.com/watch?v=pCKRWSNIaNQ

# Hand Shape Analysis

The most prominent feature of signed languages, is their use of the hands. The hands play an important role in the
phonetics of signs, and a slight variation in them can convey differences in meaning.

We use 3D pose estimation to extract a semi-accurate hand skeletal representation, and perform various techniques to
analyze meaningful information for sign language, based on the SignWriting definitions of the five major axis of hand
variation - handedness, plane, rotation, view, and shape.

![Skeleton anatomy of a hand](https://www.assh.org/handcare/servlet/servlet.FileDownload?file=00P0a00000ocFz1EAE)

## Handedness

Handedness is the distinction between the right, and left hands. Signed languages make a distinction between the
dominant hand, and non-dominant hand
(for right-handed individuals, the right hand is considered dominant, and vice-versa). One should use their dominant
hand for fingerspelling, and all one-handed signs, and their non-dominant hand for support (e.g. enumeration), and
two-handed signs.

Using pose estimation, the handedness analysis is trivial, as the pose estimation platform we use predicts which hand is
which.

## Plane

Plane is the distinction of signs in which the hand is parallel to the wall, or parallel to the floor. The variation in
plane can - but not necessarily - create a distinction between two signs. For example, in ASL the signs for "date" (a
social or romantic appointment or engagement), and for "dessert", exhibit the same hand shape, view, rotation, contact,
and movement, but differ by plane.

**Date** vs **Dessert**

![date](https://www.signbank.org/signpuddle2.0/glyphogram.php?text=AS10110S10118S20600M17x22S101101xn21S10118n17xn21S20600n11x11&pad=10&name=date)
![dessert](https://www.signbank.org/signpuddle2.0/glyphogram.php?text=AS10140S10148S20600M17x21S101401xn22S10148n17xn22S20600n11x10&pad=10&name=dessert)

To analyze each hand's plane, we compare the _dy_ and _dz_ of the _middle finger metacarpal bone_ (spanning from the _
wrist_ (or _sst_), to the _middle finger metacarpophalngeal joint_ (or _mmcp_)). If $dy = |mmcp.y - sst.y|$ is greater
than $dz = |mmcp.z - sst.z|$ we consider the hand parallel to the wall plane. Otherwise, we consider the hand parallel
to the floor plane.

## Rotation

Rotation is the _∠XY_ angle of a hand in relation to the body. SignWriting groups the hand rotation into eight equal
buckets, each spanning 45 degrees - $B_i = [-22.5 + 45*i, 22.5 + 45*i]$.

To analyze each hand's rotation, we calculate the angle of the line created by the _middle finger metacarpal bone_ -
$tan^{-1}(mmcp.y - sst.y / mmcp.x - sst.x)$, and find the bucket it should be categorized to.

## View

View is the distinction between the hand's various _y_ rotations, grouped to four categories:

1. Back - the signer can only observe the back of their hand.
2. Palm - the signer can only observe the front of their hand.
3. Sideways - the signer can observe both sides of their hand. The back of the hand on the same side as its handedness (
   e.g, the back of the hand on the right side, for the right hand).
4. Other-sideways - the signer can observe both sides of their hand, but the hand is rotated to the other side than 3.

TODO - define these better.

To estimate each hand's view, we analyze the normal of the plane created by the palm of the hand. We define the plane
created by the palm of the hand as the plane created by the following three points:

1. Index finger metacarpophalngeal joint
2. Wrist (Scaphotrapeziotrapezoidal (SST) joint)
3. Little finger metacarpophalngeal joint.

If the normal is TODO ...

## Shape

Shape is the distinctive configurations that the hand takes as it is used to form signs. Different signed languages use
different number of hand shapes (e.g. BSL is limited
to [approximately 40](https://bsl.surrey.ac.uk/principles/i-hand-shapes), while estimates of ASL handshapes
vary [from 30 to 80](https://aslfont.github.io/Symbol-Font-For-ASL/asl/handshapes.html)).

TODO add handshapes table https://aslfont.github.io/Symbol-Font-For-ASL/asl/handshapes.html

As SignWriting is designed to be a universal writing system for signed languages, it specifies a super-set of 261
distinct hand shapes, where each sign language uses a subset of these. All handshapes are specified in
the [SignWriting Hand Symbols](https://www.academia.edu/39941992/SignWriting_Hand_Symbols_in_the_International_SignWriting_Alphabet_2010)
book, including a title for each handshape, a unique identifier, and 6 examples from different plane and view, with
images of an adult white male hand.

We observe a fundamental truth - every example for each hand shape is a photograph of the same hand, and thus, given the
3D coordinates of every joint, can be transformed to the other examples by a closed, and well-defined set of
mathematical operations (namely, 3D rotation, scaling, and translation). Given this observation, the analysis of a hand
shape from an image can ignore the variation in rotation, view, and plane, and mathematically normalize any given hand
to a fixed orientation.

Thus, we go on a quest to find the best, accurate 3D hand pose estimation system, based on the 3D rotation consistency
alone: [3D Hand Pose Benchmark](https://github.com/sign/3d-hands-benchmark).
