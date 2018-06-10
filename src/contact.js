import 'botui';

const botui = new BotUI('delivery-bot');
let name = '';
let email = '';
let need = '';

botui.message
  .bot('Do you want to leave your details and let me get back to you?')
  .then(() => botui.action.button({
    addMessage: false,
    action: [{
      text: 'Yep!',
      value: 'yes'
    }, {
      text: 'No, let me get in touch.',
      value: 'no'
    }]
  }))
  .then(function(res) {
    if (res.value == 'yes') {
      botui.message.human({
        delay: 50,
        content: res.text
      });
      getContact();
    } else {
      botui.message.human({
        delay: 50,
        content: res.text
      });
      showMyContacts();
    }
  });

var getContact = function() {
  botui.message
    .bot({
      delay: 700,
      content: "Oh darn, I've not implemented a backend for this yet. How embarrasing. You can still continue the conversation so chatbot isn't lonely though... What should I call you?"
    })
    .then(function() {
      return botui.action.text({
        delay: 50,
        action: {
          size: 30,
          value: name,
          placeholder: 'Name'
        }
      })
    })
    .then(res => {
      name = res.value;
      return botui.message.bot({
        delay: 1200,
        content: `Great! ${name}, what's your email address?`
      })
    })
    .then(() => botui.action.text({
        delay: 1000,
        action: {
          size: 30,
          icon: 'email',
          value: email,
          placeholder: 'Email'
        }
      }))
    .then(res => {
      email = res.value;
      return botui.message.bot({
        delay: 1200,
        content: "What do you need?"
      })})
    .then(() => botui.action.text({
      delay: 1000,
      action: {
        size: 30,
        value: need,
        placeholder: 'I want...'
      }
    }))
    .then(res => {
      need = res.value;
      return botui.message
        .bot({
          delay: 1000,
          content: `Thanks! I'll be in touch at ${email}.`
        });
    })
    .then(() => end())
}


var showMyContacts = function() {
  botui.message
    .bot({
      delay: 1200,
      content: "Great! Do you want phone, email or social media?"
    })
    .then(() => botui.action.button({
      delay: 1000,
      addMessage: false,
      action: [{
        text: 'Phone',
        value: 'phone'
      }, {
        text: 'Email',
        value: 'email'
      }, {
        text: 'Social Media',
        value: 'social'
      }]
    }))
    .then(function(res) {
      if (res.value == 'phone') {
        botui.message.human({
          delay: 50,
          content: res.text
        });
        showPhone();
      } else if (res.value == 'email') {
        botui.message.human({
          delay: 50,
          content: res.text
        });
        showEmail();
      } else {
        botui.message.human({
          delay: 50,
          content: res.text
        });
        showSocial();
      }
    })
}

const showPhone = function() {
  botui.message
    .bot({
      delay: 1000,
      content: 'Give me a call on 07909442274'
    })
    .then(() => end());
}

const showEmail = function() {
  botui.message
    .bot({
      delay: 1000,
      content: 'Email me at joe@hanvy.uk'
    })
    .then(() => end());
}

const showSocial = function() {
  botui.message
    .bot({
      delay: 1000,
      content: 'Check out <a href="https://github.com/hanvyj">my github</a> or <a href="https://stackoverflow.com/users/1305699/joe">stack overflow</a> <br>https://github.com/hanvyj <br>https://stackoverflow.com/users/1305699/joe'
    })
    .then(() => end());
}

var end = function() {
  botui.message
    .bot({
      delay: 2000,
      content: 'Have a great day.'
    });
}