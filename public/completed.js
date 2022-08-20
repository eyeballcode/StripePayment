HTMLElement.prototype.on = HTMLElement.prototype.addEventListener

function $ (query, elem) {
  if (elem) return elem.querySelector(query)
  return document.querySelector(query)
}

setupStripe().then(checkStatus)

function hideSpinner() {
  $('#spinner').classList.add('d-none')
}

function showMessage(text) {
  $('#message').textContent = text
}

async function checkStatus() {
  let clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret'
  )

  if (!clientSecret) {
    return
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

  hideSpinner()

  switch (paymentIntent.status) {
    case 'succeeded':
      showMessage('Payment succeeded!')
      break
    case 'processing':
      showMessage('Your payment is processing.')
      break
    case 'requires_payment_method':
      showMessage('Your payment was not successful, please try again.')
      break
    default:
      showMessage('Something went wrong.')
      break
  }
}
