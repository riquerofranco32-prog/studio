import { NextResponse } from "next/server";
import { SITE } from "@/data/site";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, projectType, budget, idea, timeline, honeypot } = body;

    // Protección anti-spam con trampa honeypot
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Mensaje procesado." }, { status: 200 });
    }

    // Validaciones básicas
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 });
    }

    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: typeof company === "string" ? company.trim() : "",
      projectType: typeof projectType === "string" ? projectType : "General",
      budget: typeof budget === "string" ? budget : "A definir",
      timeline: typeof timeline === "string" ? timeline : "Flexible",
      idea: typeof idea === "string" ? idea.trim() : "",
    };

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || SITE.email;

    if (resendApiKey) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6;">
          <h2 style="color: #000; border-bottom: 2px solid #eaeaea; padding-bottom: 8px;">Nuevo contacto desde Se7en Studio</h2>
          <p><strong>Nombre:</strong> ${sanitizedData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></p>
          ${sanitizedData.company ? `<p><strong>Empresa:</strong> ${sanitizedData.company}</p>` : ""}
          <p><strong>Tipo de Proyecto:</strong> ${sanitizedData.projectType}</p>
          <p><strong>Presupuesto:</strong> ${sanitizedData.budget}</p>
          <p><strong>Plazo deseado:</strong> ${sanitizedData.timeline}</p>
          <div style="margin-top: 20px; padding: 16px; background-color: #f9f9f9; border-radius: 8px;">
            <strong>Detalle de la idea:</strong>
            <p style="white-space: pre-wrap; margin-top: 8px;">${sanitizedData.idea || "Sin detalle adicional"}</p>
          </div>
        </div>
      `;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Se7en Studio <contacto@se7enstudios.com>",
          to: [recipientEmail],
          reply_to: sanitizedData.email,
          subject: `Nuevo Proyecto: ${sanitizedData.projectType} — ${sanitizedData.name}`,
          html: emailHtml,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error al enviar email con Resend:", errorData);
      }
    } else {
      // Entorno de desarrollo o sin API key configurada
      console.log("📨 [Contacto Recibido - Modo Simulación]", sanitizedData);
    }

    return NextResponse.json(
      {
        success: true,
        message: "¡Mensaje recibido con éxito! Nos pondremos en contacto dentro de las 24 horas.",
        data: sanitizedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error procesando solicitud de contacto:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al enviar el mensaje. Por favor intentá por WhatsApp o mail." },
      { status: 500 }
    );
  }
}
