// Supabase Configuration
var SUPABASE_URL = 'https://dcxxyawykywszehghzyb.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjeHh5YXd5a3l3c3plaGdoenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTQxMTQsImV4cCI6MjA4ODM3MDExNH0.1UM0FtWflGWTVAu6KmjkOW9uBfzV5L6LGvFRXzv_aZY';

// Initialize Supabase client
var supabase = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Storage helpers
var STORAGE = {
    media: {
        bucket: 'portfolio-media',
        getPublicUrl: function(path) { return SUPABASE_URL + '/storage/v1/object/public/portfolio-media/' + path; },
    },
    documents: {
        bucket: 'documents',
    },
};
