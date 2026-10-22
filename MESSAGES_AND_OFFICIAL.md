# Message deletion and pn_official

**Delete for me / for everyone**
- Delete for me hides a message (or a whole chat) on that device only; the other person keeps it. It is stored on the device, so it does not follow the person to another device.
- Delete for everyone is offered only on messages you sent, and on a whole chat only if you started it (the oldest message is yours). Nobody can delete a received message for everyone.
- Visitor chats: the visitor can delete their own messages for everyone; the owner can delete their own replies for everyone. Each side can only hide the other's messages for themselves.

**pn_official** (create it by hand in the Firebase console: `users/{uid}` and `profiles/pn_official`, with `uid` matching its Auth account)
- Normal users can't register this name; the app only trusts the uid stored in `profiles/pn_official`.
- It shows a blue verification tick (profile, chats, inbox, search, notification).
- Its messages to a user appear as a notification in that user's bell with no dismiss button. They stay until pn_official deletes the message for everyone. Receivers can't delete them, not even for themselves.
- Users can send pn_official one message (only when the chat is empty) and can't reply afterwards. Anonymous visitors can't message it.
- Its own messages are not auto-deleted after 24 hours.
- It starts a chat the usual way: Inbox, search a username, Message.

**Automatic official notices (welcome, Digital CV, shop)**
- No setup needed. The notices are created on the device when the trigger happens and are shown as messages from PN Official (with the tick) in the notification bell and at the top of the Inbox.
- `welcome`: once per account (on that device), when the dashboard opens with a profile. `cv`: when the Digital CV card is opened. `shop`: when the Shop card is opened.
- `cv` and `shop` come back at most once every 24 hours; when they do, the older copy is replaced by the new one.
- The wording lives in `TEMPLATES` in `src/profile/lib/notices.ts`. Have it reviewed by a lawyer before you rely on it as legal terms.
- Because they are created on the device, they can't be recalled from your side, and a user on a new device sees them again once.


**Offline**
- Writes made offline are saved on the device by Firestore and sent when the connection returns. Each one shows a tiny clock until the server has it. Your own chat messages show a clock while waiting and a tick once sent.
- When the connection is back you get a "Synced N changes" message, or an error naming what couldn't be saved. A small pill at the bottom left shows "Offline · N waiting" while anything is queued.
- Uploads (pictures, video) still need internet.
