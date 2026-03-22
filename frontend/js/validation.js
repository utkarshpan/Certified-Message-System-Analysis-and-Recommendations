async function runValidation(){

    const message = localStorage.getItem("message");

    const res = await fetch("http://localhost:5000/api/validate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ platformMessage: message })
    });

    const data = await res.json();

    document.getElementById("keyword").innerText = data.keyword ? "✓ Pass" : "✗ Fail";
    document.getElementById("location").innerText = data.location ? "✓ Pass" : "✗ Fail";
    document.getElementById("time").innerText = data.time ? "✓ Pass" : "✗ Fail";
    document.getElementById("final").innerText = data.final ? "Approved ✅" : "Rejected ❌";

    if(data.final){
        setTimeout(() => {
            window.location.href = "publish-status.html";
        }, 1500);
    }
}
