let stripe

async function setupStripe() {
  const stripeData = await (await fetch('/get-stripe-data', {
     method: 'POST'
  })).json()

  stripe = Stripe(stripeData.key)
}
