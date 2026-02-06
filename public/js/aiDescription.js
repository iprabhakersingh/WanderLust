const btn = document.getElementById("aiImproveBtn");
const textarea = document.getElementById("description");

if (btn) {
    btn.addEventListener("click", async () => {
        if (!textarea.value.trim()) {
            alert("Please write a description first.");
            return;
        }

        btn.disabled = true;
        btn.innerText = "Improving...";

        const res = await fetch("/listings/ai/improve-description", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: textarea.value,
                title: document.querySelector("[name='listing[title]']")?.value,
                location: document.querySelector("[name='listing[location]']")?.value,
                country: document.querySelector("[name='listing[country]']")?.value,
                category: document.querySelector("[name='listing[category]']")?.value,
                price: document.querySelector("[name='listing[price]']")?.value,
            }),
        });

        const data = await res.json();
        textarea.value = data.improvedDescription;

        btn.disabled = false;
        btn.innerText = "✨ Improve with AI";
    });
}
