# Wastewater Reuse
Blockchain and Anomaly Detection based Monitoring System for Enforcing Wastewater Reuse

## Inspiration
We got motivated to do this project as it lets us be innovative and provide a solution to a large scale problem.

## What it does
Our solution uses blockchain to create a tamper-proof record of IoT meter readings and provide tokens on quantity and quality of wasewater reused. We also use different machine learning algorithms, namely- polynomial regression, clustering with dB Scan, and deep learning models- autoencoders and LSTM.  

## How we built it
We built a node.js server on which our front-end was deployed. Queries from our front-end are passed to the blockchain via rest-api server. Anomaly detection model was run on flask server which is used to detect tampered IoT meter readings. 

## Challenges we ran into
Implementing an incentive model, using blockchain based tokens, that incorporates different types of organizations. 
Coming up with a machine learning model that fits seemingly countless possibilities of fraud.

## Accomplishments that we're proud of
We deployed our model on Hyperledger successfully. We were able  to notice some patterns of tampering on the IoT meters to train our model for.

## What we learned
We got a peek into implementing a real-life solution that affects a really large audience. 

## What's next for us
Once blockchain scales, our solution can be considered for deploying on a larger scale. Our machine learning algorithms can be trained for more cases of tampering.
