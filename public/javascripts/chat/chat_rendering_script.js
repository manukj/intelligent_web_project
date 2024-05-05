function createChatMessageElement(message) {
  // Create chat message elements
  const chatMessageDiv = document.createElement("div");
  chatMessageDiv.classList.add(
    "chat",
    message.user_name === loggedInUserName ? "chat-end" : "chat-start"
  );

  const chatImageDiv = document.createElement("div");
  chatImageDiv.classList.add("chat-image", "avatar");
  chatImageDiv.innerHTML = `
      <div class="avatar placeholder rounded-full border bg-neutral  p-1">
        <div class="text-neutral-content rounded-full bg-white  w-8">
          <span class="text font-extrabold text-neutral">${message.user_name
            .substring(0, 2)
            .toUpperCase()}</span>
        </div>
      </div>
    `;

  const chatHeaderDiv = document.createElement("div");
  chatHeaderDiv.classList.add("chat-header");
  chatHeaderDiv.textContent = message.user_name;

  const chatBubbleDiv = document.createElement("div");
  if (message.suggested_name && message.suggested_name.name) {
    chatBubbleDiv.classList.add("chat-bubble", "chat-bubble-primary");
  } else {
    chatBubbleDiv.classList.add("chat-bubble");
  }
  chatBubbleDiv.classList.add("chat-bubble");
  chatBubbleDiv.textContent = message.chat_message;

  const chatFooterDiv = document.createElement("div");
  chatFooterDiv.classList.add("chat-footer");
  chatFooterDiv.innerHTML = `<time class="text-xs opacity-50">${message.chat_time}</time>`;

  // Append elements to chat container
  chatMessageDiv.appendChild(chatImageDiv);
  chatMessageDiv.appendChild(chatHeaderDiv);
  chatMessageDiv.appendChild(chatBubbleDiv);
  chatMessageDiv.appendChild(chatFooterDiv);

  return chatMessageDiv;
}
