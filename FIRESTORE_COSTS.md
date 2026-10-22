# Firestore cost notes

What was changed to keep reads and writes low, with every feature still working:

- One shared listener per query. The Inbox, the bell alerts and the Shop used to each listen to the same conversations and orders; now they share one (`lib/shared.ts`, `lib/convStore.ts`). It stays alive for 30s after the last screen leaves.
- Unread counts and Inbox previews are read once and only again when that conversation actually changes, instead of one live listener per conversation.
- pn_official's pinned notice reads only when its conversation changes.
- Likes use a count query plus one read for "did I like it", instead of listening to every like document. Counts update instantly on your own taps.
- Comments are listened to only while a post's comments are open. A closed post shows a count from one cheap count query.
- Public profile no longer re-reads all posts every 30 seconds or on every tab switch; the live listener already keeps it current.
- Username search waits for 3 characters and 450ms, skips the extra exact-match read, and remembers results for the session.
- Open chats load the latest 100 messages (they expire after 24h anyway).
- Commenter names/photos are fetched once per username instead of once per comment.

Trade-offs: like counts from other people appear after a refresh, not live; comment counts on closed posts are from page load.
