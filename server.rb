require 'bundler/setup'
require 'sinatra'
require 'stripe'
require 'yaml'

config = YAML.load_file('config.yaml')

Stripe.api_key = (config['mode'] == 'live') ? config['live_secret_key'] : config['test_secret_key']

set :static, true
set :port, 8008
set :bind, '0.0.0.0'

get '/' do
  send_file 'html/index.html'
end

get '/completed' do
  send_file 'html/completed.html'
end

post '/get-stripe-data' do
  {
    key: (config['mode'] == 'live') ? config['live_api_key'] : config['test_api_key']
  }.to_json
end

post '/create-payment-intent' do
  content_type 'application/json'
  data = JSON.parse(request.body.read)

  # Create a PaymentIntent with amount and currency
  payment_intent = Stripe::PaymentIntent.create(
    amount: data['amount'],
    currency: 'sgd',
    payment_method_types: ['paynow']
  )

  {
    clientSecret: payment_intent['client_secret']
  }.to_json
end
