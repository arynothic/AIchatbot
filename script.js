
    
    const apiKey = "AIzaSyApIdnFnQKn9MfRD3ETlEEfVl-xiguAeIw";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const chatbox = document.getElementById('chatbox');
    const input = document.getElementById('userInput');
    let history = [];

    const avatars = {
      user: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
      model: "https://cdn-icons-png.flaticon.com/512/4712/4712104.png"
    };

    function loadHistory() {
      const saved = localStorage.getItem("Ai chat history");
      if (saved) {
        history = JSON.parse(saved);
        history.forEach(msg => appendMessage(msg.role, msg.parts[0].text));
      }
    }

    loadHistory();

    function appendMessage(role, text) {
      const div = document.createElement("div");
      div.className = `chat-entry ${role} animate__animated animate__fadeInUp`;

      const avatar = document.createElement("img");
      avatar.className = "avatar";
      avatar.src = avatars[role];

      const bubble = document.createElement("div");
      bubble.className = "bubble";

      let i = 0;
      const plainText = marked.parse(text).replace(/<[^>]*>/g, "");
      const typeEffect = () => {
        if (i < plainText.length) {
          bubble.innerHTML = plainText.substring(0, i + 1);
          i++;
          setTimeout(typeEffect, 10);
        }
      };
      typeEffect();

      div.appendChild(avatar);
      div.appendChild(bubble);
      chatbox.appendChild(div);
      chatbox.scrollTop = chatbox.scrollHeight;
    }

    async function sendMessage() {
      const userText = input.value.trim();
      if (!userText) return;
      appendMessage("user", userText);
      history.push({ role: 'user', parts: [{ text: userText }] });
      input.value = "";

      const typingDiv = document.createElement("div");
      typingDiv.className = "chat-entry model";
      typingDiv.innerHTML = `<img class="avatar" src="${avatars.model}" /><div class="bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
      chatbox.appendChild(typingDiv);
      chatbox.scrollTop = chatbox.scrollHeight;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history })
      });

      chatbox.removeChild(typingDiv);

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
      appendMessage("model", reply);
      speakText(reply);
      history.push({ role: 'model', parts: [{ text: reply }] });
      localStorage.setItem("Ai chat history", JSON.stringify(history));
    }

    function clearChat() {
      localStorage.removeItem("Ai chat history");
      chatbox.innerHTML = "";
      history = [];
    }

    function downloadChat() {
      if (!history.length) return;
      let textContent = "Ai chat history\n\n";
      history.forEach(msg => {
        const sender = msg.role === 'user' ? "You" : "AI";
        textContent += `${sender}: ${msg.parts[0].text}\n\n`;
      });
      const blob = new Blob([textContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Ai chat history.txt";
      link.click();
    }

    function changeTheme(theme) {
      document.body.className = theme;
    }

    function startListening() {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event) => {
        input.value = event.results[0][0].transcript;
      };
    }

    function speakText(text) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
    }
    

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") sendMessage();
    });
  