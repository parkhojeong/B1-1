// These EmailJS identifiers are public browser settings, not private credentials.
const emailJSConfig = {
    serviceId: "service_y46mwmc",
    templateId: "template_rz5gize",
    publicKey: "Xj5BPSVB95EXzfNp4",
};

async function sendContactEmail(templateParams, signal) {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: emailJSConfig.serviceId,
            template_id: emailJSConfig.templateId,
            user_id: emailJSConfig.publicKey,
            template_params: {
                ...templateParams,
                time: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
            },
        }),
        signal,
    });

    if (!response.ok) {
        throw new Error(response.status === 429
            ? "Too many submissions. Please try again later."
            : "Your message could not be sent. Please try again.");
    }
}
