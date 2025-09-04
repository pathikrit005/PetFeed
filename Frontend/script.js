// -------------------- HELPERS --------------------
const apiBase = "https://petfeed.onrender.com";

// Reusable Fetch wrapper
async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const res = await fetch(`${apiBase}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (err) {
    console.error("❌ API Error:", err.message);
    alert("❌ " + err.message);
    throw err;
  }
}

// -------------------- AUTH UI HANDLER --------------------
function updateAuthUI() {
  const userId = localStorage.getItem("userId");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const getStartedBtn = document.getElementById("getStartedBtn");
  const profileBtn = document.getElementById("profileBtn");

  if (userId) {
    loginBtn?.style.setProperty("display", "none");
    getStartedBtn?.style.setProperty("display", "none");
    profileBtn?.style.setProperty("display", "inline-block");

    if (signupBtn) {
      signupBtn.textContent = "Logout";
      signupBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("userId");
        alert("😿Logged out!");
        window.location.href = "index.html";
      };
    }
  } else {
    loginBtn?.style.setProperty("display", "inline-block");
    signupBtn?.style.setProperty("display", "inline-block");
    getStartedBtn?.style.setProperty("display", "inline-block");
    profileBtn?.style.setProperty("display", "none");
  }
}
document.addEventListener("DOMContentLoaded", updateAuthUI);

// -------------------- PROFILE ACCESS GUARD --------------------
document.addEventListener("DOMContentLoaded", () => {
  const onProfile = window.location.pathname.includes("petprofile.html");
  const userId = localStorage.getItem("userId");
  const profileBtn = document.getElementById("profileBtnt");

  if (onProfile) {
    if (!userId) {
      // not logged in → redirect
      window.location.href = "login.html";
    } else {
      // logged in → show profile section
      if (profileBtn) profileBtn.style.display = "block";
    }
  }
});

// -------------------- SIGNUP --------------------
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = signupName.value, email = signupEmail.value, password = signupPassword.value;

  const data = await apiRequest("/signup", "POST", { name, email, password });
  alert("😻 Signup successful! Please login now.🐶");
  window.location.href = "index.html";
});

// -------------------- LOGIN --------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginEmail.value, password = loginPassword.value;

  const data = await apiRequest("/login", "POST", { email, password });
  alert("😻🐶 Login successful! ✅");
  localStorage.setItem("userId", data.userId);
  window.location.href = "petprofile.html";
});

// -------------------- PET PROFILE --------------------
document.getElementById("petForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = localStorage.getItem("userId");
  //Store pet data
  const payload = {
    userId,
    name: inputPetName.value,
    type: inputPetType.value,
    breed: inputPetBreed.value,
    age: inputPetAge.value,
    toy: inputPetToy.value,
    personality: inputPetPersonality.value,
  };

  await apiRequest("/pet", "POST", payload);
  alert("🐶😻 Pet saved successfully!✅");
});

// -------------------- POST --------------------
document.getElementById("postForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = localStorage.getItem("userId");
  if (!userId) return (window.location.href = "login.html");

  const content = postContent.value.trim();
  if (!content) return alert("❌ Post cannot be empty!");

  await apiRequest("/post", "POST", { userId, content });
  alert("🐶😻Post submitted!✅");
  postForm.reset();

  // Append new post to feed
  const feed = document.querySelector(".feed");
  if (feed) {
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
      <div class="post-content">
        <div class="post-header">
          <img src="https://plus.unsplash.com/premium_photo-1726880485802-3352330f3205?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User" class="user-avatar">
          <div class="post-meta">
            <div class="post-username">@pet_person</div>
            <div class="post-date">just now</div>
          </div>
        </div>
        <p class="post-text">${content}</p>
        <div class="post-actions">
          <button class="like-btn">
            <i class="far fa-heart"></i>
            <span class="like-count">0</span>
          </button>
        </div>
      </div>
    `;
    feed.prepend(post); // new post on top
    attachLikeHandler(post.querySelector(".like-btn"));
  }
});

// -------------------- LIKE BUTTON --------------------
function attachLikeHandler(button) {
  button.addEventListener("click", () => {
    const icon = button.querySelector("i");
    const count = button.querySelector(".like-count");
    const liked = icon.classList.contains("fas");

    icon.classList.toggle("fas", !liked);
    icon.classList.toggle("far", liked);
    count.textContent = parseInt(count.textContent, 10) + (liked ? -1 : 1);
  });
}
// Attach to existing posts
document.querySelectorAll(".like-btn").forEach(attachLikeHandler);

