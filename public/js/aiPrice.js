const aiBtn = document.getElementById("ai-price-btn");

if (aiBtn) {
  aiBtn.addEventListener("click", async () => {
    const title = document.querySelector("[name='listing[title]']").value;
    const description = document.querySelector("[name='listing[description]']").value;
    const location = document.querySelector("[name='listing[location]']").value;
    const country = document.querySelector("[name='listing[country]']").value;
    const category = document.querySelector("[name='listing[category]']").value;
    const priceInput = document.querySelector("[name='listing[price]']");

    aiBtn.innerText = "🤖 Thinking...";
    aiBtn.disabled = true;

    const res = await fetch("/listings/ai/suggest-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        location,
        country,
        category
      })
    });

    const data = await res.json();
    priceInput.value = data.aiPrice;

    aiBtn.innerText = "🤖 AI Price";
    aiBtn.disabled = false;
  });
}
