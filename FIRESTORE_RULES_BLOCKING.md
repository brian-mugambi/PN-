# Blocking: Firestore rules

The app enforces blocking in its own screens and checks before sending. To enforce it at the database as well, add rules like these
and adapt the names to your existing rules (they are examples; your current rules file isn't part of this project).

Data written by the app:

- `blocks/{ownerUid}/visitors/{visitorId}`: an anonymous visitor (their device ID) the owner blocked.
- `blocks/{ownerUid}/members/{uid}`: a signed-in member the owner blocked (`uid`, `username`, `name`, `createdAt`).

```
match /blocks/{owner}/visitors/{visitorId} {
  allow get: if true;                                   // a visitor's device checks whether it is blocked
  allow list, write: if request.auth != null && request.auth.uid == owner;
}
match /blocks/{owner}/members/{uid} {
  allow get: if request.auth != null && (request.auth.uid == owner || request.auth.uid == uid);
  allow list, write: if request.auth != null && request.auth.uid == owner;
}
```

To make the block hold even against a modified client, add a "not blocked" condition to the existing create rules:

```
function blockedVisitor(owner, visitorId) { return exists(/databases/$(database)/documents/blocks/$(owner)/visitors/$(visitorId)); }
function blockedMember(owner)             { return request.auth != null && exists(/databases/$(database)/documents/blocks/$(owner)/members/$(request.auth.uid)); }

// visitor messages: conversation id is {ownerUid}_{visitorId}
//   allow create: if ... && !blockedVisitor(<ownerUid>, <visitorId>) && !blockedMember(<ownerUid>);
// likes and comments on posts: the post's ownerId is the owner
//   allow create: if ... && !blockedMember(get(/databases/$(database)/documents/posts/$(postId)).data.ownerId);
// shop purchase attempts (orders): ownerId and deviceId are fields of the new document
//   allow create: if ... && !blockedVisitor(request.resource.data.ownerId, request.resource.data.deviceId)
//                        && !blockedMember(request.resource.data.ownerId);
// direct messages: the other member of the conversation is the owner
//   allow create: if ... && !blockedMember(<the other member's uid>);
```

Until these rules are published, blocking is enforced by the app only: someone using the app as built can't get around it,
but a hand-made request to the database could.
