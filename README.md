ISyTT is an open source version of the popular IFFT built on
the Singly API (singly.com). Please contribute your own if and
then scripts to make more recipes available to all of us! 

Write your recipes in server.js with existing scripts and 
don't be shy to write your own scripts.

When you're ready, deploy to a live host (we think Heroku is easiest),
and click on the Singly push subscriptions that you need to have access
to. You'll also need to sign up for a singly app in order to receive
the push notifications that initiate the recipes.

Write if scripts in the ifs/ directory and write then scripts
in the thens/ directory. No need to export anything, that is handled
automatically. Just the name the script either <check>.js or <action>.js
and that script will be exported accordingly.

Be sure to copy config/config.json.example to config/config.json and fill
in your details. Additionally, for certain scripts to function, you need to set
environment variables.

Here is a list of all the present environment variables:

CLIENT_ID:
CLIENT_SECRET:
GMAIL_PASSWORD:
GMAIL_USER:
HOST:
PATH:
TWILIO_HOSTNAME:
TWILIO_HOSTNUMBER:
TWILIO_SID:
TWILIO_TOKEN:
