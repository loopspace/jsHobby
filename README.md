# Quick Hobby Algorithm

This is a variation of John Hobby's algorithm 
One difficulty with Hobby's algorithm is that it works with the path as a whole.
It is therefore not possible to build up a path piecewise.
We therefore modify it to correct for this.
Obviously, the resulting path will be less ``ideal'', but will have the property that adding new points will not affect earlier segments.
The method we use is to employ Hobby's algorithm on two-segment subpaths.
When applied to a two-segment subpath, the algorithm provides two cubic Bezier curves: one from the \(k\)th point to the \(k+1\)st point and the second from the \(k+1\)st to the \(k+2\)nd.
Of this data, we keep the first segment and use that for the path between the \(k\)th and \(k+1\)st points.
We also remember the outgoing angle of the first segment and use that as the incoming angle on the next computation (which will involve the \(k+1\)st, \(k+2\)nd, and \(k+3\)rd points).
The two ends are slightly different to the middle segments.
On the first segment, we might have no incoming angle.
On the last segment, we render both pieces.

For Mathematical details, see the documentation of the LaTeX hobby package.
