import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { listTitle, listOwnerName, listOwnerEmail, recipientEmail, permission } = await req.json()

    // Basic email content
    const subject = `${listOwnerName} shared a shopping list with you`
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">You've been invited to collaborate!</h2>
        
        <p>Hi there,</p>
        
        <p><strong>${listOwnerName}</strong> (${listOwnerEmail}) has shared their shopping list "<strong>${listTitle}</strong>" with you.</p>
        
        <p><strong>Permission level:</strong> ${permission === 'edit' ? 'Can Edit' : 'View Only'}</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>What's next?</strong></p>
          <ol>
            <li>Sign in to Shopping List Organizer: <a href="https://shopping-organizer-green.vercel.app">https://shopping-organizer-green.vercel.app</a></li>
            <li>Click "Shared Lists" to see lists shared with you</li>
            <li>Start collaborating on your shopping lists!</li>
          </ol>
        </div>
        
        <p>Happy shopping!</p>
        <p><em>The Shopping List Organizer Team</em></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This invitation was sent because ${listOwnerEmail} shared a shopping list with ${recipientEmail}. 
          If you did not expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `

    // Get Resend API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    // Send email using Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Shopping List Organizer <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: subject,
        html: htmlContent,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      throw new Error(`Resend API error: ${resendResponse.status} ${errorData}`)
    }

    const resendData = await resendResponse.json()
    console.log('✅ Email sent successfully via Resend:', {
      id: resendData.id,
      to: recipientEmail,
      subject: subject
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation email sent successfully',
        emailId: resendData.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in send-invitation-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})