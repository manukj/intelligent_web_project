function createChatMessageElement(message) {
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

  const chatBubbleDiv = createChatBubble(message);
  const chatFooterDiv = createChatFooter(message);

  // Append elements to chat container
  chatMessageDiv.appendChild(chatImageDiv);
  chatMessageDiv.appendChild(chatHeaderDiv);
  chatMessageDiv.appendChild(chatBubbleDiv);
  chatMessageDiv.appendChild(chatFooterDiv);

  return chatMessageDiv;
}
function createChatBubble(message) {
  const chatBubbleDiv = document.createElement("div");
  chatBubbleDiv.classList.add("chat-bubble", "flex", "flex-row");
  if (message.suggested_name && message.suggested_name.name) {
    chatBubbleDiv.classList.add("shadow-2xl","shadow-info-3");
  }

  // Creating and styling the label for "Suggested Name:"
  const nameLabel = document.createElement("span");
  nameLabel.textContent = "Suggested Name: ";
  nameLabel.classList.add("text-green-200", "px-2", "font-bold",); // Applying the grey color to the label

  // Creating and appending the message text element
  const messageText = document.createElement("span");
  messageText.textContent = message.chat_message;

  // Append both nameLabel and messageText to the chatBubbleDiv
  if (message.suggested_name && message.suggested_name.name) {
    chatBubbleDiv.appendChild(nameLabel);
  }
  chatBubbleDiv.appendChild(messageText);
  return chatBubbleDiv;
}
function createChatFooter(chat, name = "Mark") {
  const chatFooterDiv = document.createElement("div");
  if (chat.user_name === loggedInUserName) {
    chatFooterDiv.classList.add("chat-footer", "flex", "flex-col", "items-end");
  } else {
    chatFooterDiv.classList.add(
      "chat-footer",
      "flex",
      "flex-col",
      "items-start"
    );
  }

  if (chat.suggested_name && chat.suggested_name.name) {
    if (chat.suggested_name.isApprovedByOwner) {
      const approvedDiv = document.createElement("div");
      approvedDiv.className = "text-xs opacity-50 text-success";
      approvedDiv.textContent = "✅︎ Approved by " + plantOwner;
      chatFooterDiv.appendChild(approvedDiv);
    } else {
      if (chat.user_name === loggedInUserName) {
        const approveBtn = document.createElement("div");
        approveBtn.className = "btn btn-link btn-xs w-fit";

        approveBtn.textContent = "✓ Approve Suggested Name";
        approveBtn.onclick = function () {
          chat.suggested_name.isApprovedByOwner = true;
          console.log("Approved by", loggedInUser);
        };
        chatFooterDiv.appendChild(approveBtn);
      } else {
        const pendingApprovalDiv = document.createElement("div");
        pendingApprovalDiv.className = "text-xs opacity-50 text-error mt-1";
        pendingApprovalDiv.textContent = "⏰ Pending " + plantOwner + " Approval";
        chatFooterDiv.appendChild(pendingApprovalDiv);
      }
    }
  }

  const timeElement = document.createElement("time");
  timeElement.className = "text-xs opacity-50";
  timeElement.textContent = chat.chat_time.toLocaleString();
  chatFooterDiv.appendChild(timeElement);

  return chatFooterDiv;
}
