class ErrorResponse extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export default function request(url, options) {
  return new Promise(async (resolve, reject) => {
    let res = await fetch(url, options);
    if (res.ok === false) {
      reject(new ErrorResponse(res.status, res.statusText));
    }
    let data = await res.json();
    resolve(data);
  });
}

const formInput = document.querySelector("#form");

formInput.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    let user = {
      email: this.email.value,
      password: this.password.value,
    };
    await request("https://reqres.in/api/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });
    location = "../teachers.html";
  } catch (err) {
    alert("Xato kodni tog'rlap tering");
  }
});


const loading = document.getElementById("loading");

const loadingDuration = 4000; 

setTimeout(() => {
  loading.classList.add("loading-none");
}, loadingDuration);