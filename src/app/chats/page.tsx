import ChatList from "../home/ChatList"

export default function ChatsPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white px-4 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">Chats</h1>
          <p className="text-sm text-white/60">Continue your conversations</p>
        </header>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <ChatList />
        </div>
      </div>
    </div>
  )
}
