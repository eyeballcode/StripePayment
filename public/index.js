let elements

HTMLElement.prototype.on = HTMLElement.prototype.addEventListener

function $ (query, elem) {
  if (elem) return elem.querySelector(query)
  return document.querySelector(query)
}

function setLoading(isLoading) {
  if (isLoading) {
    $('#pay-now').disabled = true
    $('#spinner').classList.remove('d-none')
    $('#button-text').classList.add('d-none')
  } else {
    $('#pay-now').disabled = false
    $('#spinner').classList.add('d-none')
    $('#button-text').classList.remove('d-none')
  }
}

function waitForMountLoaded() {
  let interval = setInterval(() => {
    let iframe = $('#hidden-mount > iframe')
  }, 100)
}

async function onPayNowClicked() {
  setLoading(true)

  const { clientSecret } = await (await fetch('/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 100 * parseFloat($('#amount').value) }),
  })).json()

  elements = stripe.elements({
    appearance: {
      theme: 'stripe'
    },
    clientSecret
  })

  const paymentElement = elements.create('payment')
  paymentElement.mount('#hidden-mount')

  $('#hidden-mount iframe').on('load', () => {
    setTimeout(async () => {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `http://${location.hostname}/completed`,
        },
      })

      console.log(error);
    }, 1000)
  })
}

function setupButton() {
  $('#pay-now').on('click', e => {
    let form = $('#payment-form')
    let valid = form.checkValidity()
    form.classList.add('was-validated')

    e.preventDefault()

    if (valid) onPayNowClicked()
  })
}

setupButton()
setupStripe()

//
// // Fetches the payment intent status after payment submission
// async function checkStatus() {
//   const clientSecret = new URLSearchParams(window.location.search).get(
//     'payment_intent_client_secret'
//   )
//
//   if (!clientSecret) {
//     return
//   }
//
//   const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
//
//   switch (paymentIntent.status) {
//     case 'succeeded':
//       showMessage('Payment succeeded!')
//       break
//     case 'processing':
//       showMessage('Your payment is processing.')
//       break
//     case 'requires_payment_method':
//       showMessage('Your payment was not successful, please try again.')
//       break
//     default:
//       showMessage('Something went wrong.')
//       break
//   }
// }
//
// // ------- UI helpers -------
//
// function showMessage(messageText) {
//   const messageContainer = $('#payment-message')
//
//   messageContainer.classList.remove('hidden')
//   messageContainer.textContent = messageText
//
//   setTimeout(function () {
//     messageContainer.classList.add('hidden')
//     messageText.textContent = ''
//   }, 4000)
// }
//
// // Show a spinner on payment submission
// function setLoading(isLoading) {
//   if (isLoading) {
//     // Disable the button and show a spinner
//     $('#submit').disabled = true
//     document.querySelector('#spinner').classList.remove('hidden')
//     document.querySelector('#button-text').classList.add('hidden')
//   } else {
//     document.querySelector('#submit').disabled = false
//     document.querySelector('#spinner').classList.add('hidden')
//     document.querySelector('#button-text').classList.remove('hidden')
//   }
// }
