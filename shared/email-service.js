// Email Service — sends email via Supabase Edge Function (Resend)
// Requires: shared/supabase.js loaded first

var EmailService = {
    /**
     * Send an email
     * @param {Object} opts
     * @param {string|string[]} opts.to - Recipient(s)
     * @param {string} opts.subject - Subject line
     * @param {string} opts.html - HTML body
     * @param {string} [opts.from] - From address (default: onboarding@resend.dev)
     * @returns {Promise<{success: boolean, id?: string, error?: string}>}
     */
    send: async function(opts) {
        if (!supabase) throw new Error('Supabase client not initialized');

        var session = await supabase.auth.getSession();
        var token = session.data.session?.access_token;
        if (!token) throw new Error('Not authenticated');

        var res = await fetch(SUPABASE_URL + '/functions/v1/send-email', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opts),
        });

        return res.json();
    }
};
