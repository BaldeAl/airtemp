import Head from "next/head";
import Layout from "../../components/Layout";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/loading/Loading";
import Link from "next/link";
import { useTranslation } from "../../lib/i18n/LanguageContext";
import {
  HiChat,
  HiArrowLeft,
  HiPaperAirplane,
  HiUser,
  HiDotsVertical,
} from "react-icons/hi";

function timeAgo(date, locale) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);

  // Basic localization mapping for simple strings (you might want to put this in language files later if it gets complex)
  const isFr = locale === "fr-FR";

  if (mins < 1) return isFr ? "À l'instant" : "Just now";
  if (mins < 60) return isFr ? `Il y a ${mins}m` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return isFr ? `Il y a ${hours}h` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return isFr ? `Il y a ${days}j` : `${days}d ago`;

  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // { userId, messages, otherUser }
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { contact, placeId } = router.query;
  const { t, dateLocale } = useTranslation();

  // Fetch conversations list
  const fetchConversations = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setConversations([]);
      return;
    }

    fetch("/api/messages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setConversations(data.conversations || []))
      .catch(() => setConversations([]));
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // If navigated with ?contact=userId, open that conversation
  useEffect(() => {
    if (contact) {
      openChat(Number(contact));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const openChat = async (otherUserId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/messages/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setActiveChat({
        userId: otherUserId,
        messages: data.messages || [],
        otherUser: data.otherUser,
      });
      // Refresh conversations to update unread counts
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: activeChat.userId,
          content: newMessage.trim(),
          ...(placeId ? { placeId: Number(placeId) } : {}),
        }),
      });

      if (res.ok) {
        const msg = await res.json();
        setActiveChat((prev) => ({
          ...prev,
          messages: [...prev.messages, msg],
        }));
        setNewMessage("");
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (conversations === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>{t("messages.title")} – AirAl</title>
        </Head>
        <Layout>
          <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
            <div className="text-center max-w-md animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#A29BFE]/10 flex items-center justify-center">
                <HiChat className="text-4xl text-[#A29BFE]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#2D3436] dark:text-white mb-3">
                {t("messages.signInToView")}
              </h1>
              <p className="text-[#636E72] dark:text-[#B2BEC3] mb-8 text-sm">
                {t("messages.signInDescription")}
              </p>
              <Link
                href="/Auth/login/"
                className="btn-pill px-8 py-3 text-base"
              >
                {t("auth.login")}
              </Link>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  })();

  return (
    <>
      <Head>
        <title>{t("messages.title")} – AirAl</title>
        <meta name="description" content="Your messages on AirAl" />
      </Head>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
          <div
            className="card-cartoon overflow-hidden"
            style={{ minHeight: "calc(100vh - 220px)" }}
          >
            <div
              className="flex h-full"
              style={{ minHeight: "calc(100vh - 220px)" }}
            >
              {/* Sidebar - Conversations List */}
              <div
                className={`${
                  activeChat ? "hidden md:flex" : "flex"
                } flex-col w-full md:w-80 lg:w-96 border-r border-[#E8E8E4] dark:border-[#2D2D4A]`}
              >
                <div className="p-4 sm:p-5 border-b border-[#E8E8E4] dark:border-[#2D2D4A]">
                  <h1 className="text-xl font-extrabold text-[#2D3436] dark:text-white flex items-center gap-2">
                    <HiChat className="text-[#A29BFE]" />
                    {t("messages.title")}
                  </h1>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="w-16 h-16 mb-4 rounded-full bg-[#A29BFE]/10 flex items-center justify-center">
                        <HiChat className="text-3xl text-[#A29BFE]/40" />
                      </div>
                      <h3 className="text-base font-extrabold text-[#2D3436] dark:text-white mb-1">
                        {t("messages.noMessages")}
                      </h3>
                      <p className="text-xs text-[#B2BEC3]">
                        {t("messages.startConversation")}
                      </p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <button
                        key={conv.otherUser.user_id}
                        onClick={() => openChat(conv.otherUser.user_id)}
                        className={`w-full text-left p-4 border-b border-[#F0F0EC] dark:border-[#2D2D4A] hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] transition-all ${
                          activeChat?.userId === conv.otherUser.user_id
                            ? "bg-[#F0F0EC] dark:bg-[#2D2D4A]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {conv.otherUser.avatar ? (
                              <img
                                src={conv.otherUser.avatar}
                                alt=""
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              conv.otherUser.name?.charAt(0)?.toUpperCase() ||
                              "U"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-[#2D3436] dark:text-white truncate">
                                {conv.otherUser.name}
                              </span>
                              <span className="text-xs text-[#B2BEC3] flex-shrink-0 ml-2">
                                {timeAgo(
                                  conv.lastMessage.createdAt,
                                  dateLocale,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <p className="text-xs text-[#636E72] dark:text-[#B2BEC3] truncate">
                                {conv.lastMessage.content}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className="ml-2 w-5 h-5 rounded-full bg-[#FF6B6B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div
                className={`${
                  activeChat ? "flex" : "hidden md:flex"
                } flex-col flex-1`}
              >
                {activeChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-[#E8E8E4] dark:border-[#2D2D4A]">
                      <button
                        onClick={() => setActiveChat(null)}
                        className="md:hidden p-2 rounded-full hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] transition-all"
                      >
                        <HiArrowLeft className="text-lg text-[#636E72]" />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {activeChat.otherUser?.avatar ? (
                          <img
                            src={activeChat.otherUser.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          activeChat.otherUser?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#2D3436] dark:text-white">
                          {activeChat.otherUser?.name ||
                            t("booking_form.guest")}
                        </h3>
                        {activeChat.otherUser?.role && (
                          <span className="text-xs text-[#B2BEC3]">
                            {activeChat.otherUser.role === "HOST"
                              ? t("messages.host")
                              : t("messages.guest")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {activeChat.messages.length === 0 && (
                        <div className="text-center py-8 text-sm text-[#B2BEC3]">
                          {t("messages.startChat")} 👋
                        </div>
                      )}
                      {activeChat.messages.map((msg) => {
                        const isMine = msg.sender?.user_id === currentUserId;
                        return (
                          <div
                            key={msg.id || msg.message_id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                                isMine
                                  ? "bg-[#FF6B6B] text-white rounded-br-md"
                                  : "bg-[#F0F0EC] dark:bg-[#2D2D4A] text-[#2D3436] dark:text-white rounded-bl-md"
                              }`}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                              <p
                                className={`text-[10px] mt-1 ${
                                  isMine ? "text-white/60" : "text-[#B2BEC3]"
                                }`}
                              >
                                {timeAgo(msg.createdAt, dateLocale)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                      onSubmit={sendMessage}
                      className="flex items-center gap-2 p-4 border-t border-[#E8E8E4] dark:border-[#2D2D4A]"
                    >
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t("messages.typeMessage")}
                        className="flex-1 px-4 py-3 rounded-full bg-[#F0F0EC] dark:bg-[#1A1A2E] border-2 border-transparent focus:border-[#A29BFE] outline-none text-sm text-[#2D3436] dark:text-white placeholder:text-[#B2BEC3] transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-11 h-11 rounded-full bg-[#FF6B6B] hover:bg-[#E85555] text-white flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
                      >
                        <HiPaperAirplane className="text-lg transform rotate-90" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-20 h-20 mb-4 rounded-full bg-[#A29BFE]/10 flex items-center justify-center">
                      <HiChat className="text-4xl text-[#A29BFE]/40" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-1">
                      {t("messages.selectConversation")}
                    </h3>
                    <p className="text-sm text-[#B2BEC3]">
                      {t("messages.chooseConversation")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
