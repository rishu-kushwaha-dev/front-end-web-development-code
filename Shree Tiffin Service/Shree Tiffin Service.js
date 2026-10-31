document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you! We will contact you soon.");
  this.reset();
});
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href && href !== "#") {
      e.preventDefault();
      const t = document.querySelector(href);
      if (t) t.scrollIntoView({ behavior: "smooth" });
    }
  });
});
document.querySelectorAll(".faq-q").forEach((q) => {
  q.addEventListener("click", () => q.parentElement.classList.toggle("open"));
});
const topBtn = document.getElementById("topBtn");
if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  topBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  topBtn.style.display = "none";
}
document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("oName").value;
  const phone = document.getElementById("oPhone").value;
  const addr = document.getElementById("oAddr").value;
  const plan = document.getElementById("oPlan").value;
  const tiffinType = document.getElementById("oTiffinType").value;
  const qty = document.getElementById("oQty").value;

  const extras = [];
  if (document.getElementById("extraRoti").checked) extras.push("Extra Roti");
  if (document.getElementById("noRice").checked)
    extras.push("No Rice (Only Roti)");
  if (document.getElementById("lessOil").checked) extras.push("Less Oil");
  if (document.getElementById("lessSpicy").checked) extras.push("Less Spicy");
  const custom = extras.length ? "%0ACustomization: " + extras.join(", ") : "";

  const msg =
    "New Order:%0AName: " +
    name +
    "%0APhone: " +
    phone +
    "%0AAddress: " +
    addr +
    "%0APlan: " +
    plan +
    "%0ATiffin Type: " +
    tiffinType +
    custom +
    "%0AQty: " +
    qty;
  window.open("https://wa.me/919569614016?text=" + msg, "_blank");

  const status = document.getElementById("orderStatus");
  if (status) {
    status.style.display = "block";
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

const mockPayBtn = document.getElementById("mockPayBtn");
if (mockPayBtn) {
  mockPayBtn.addEventListener("click", function () {
    const msgEl = document.getElementById("payMsg");
    mockPayBtn.disabled = true;
    mockPayBtn.textContent = "Processing...";
    setTimeout(() => {
      mockPayBtn.textContent = "Payment Successful ✓";
      if (msgEl) {
        msgEl.textContent =
          "Payment confirmed! We will start preparing your order.";
        msgEl.style.color = "#2e7d32";
      }
    }, 1000);
  });
}
