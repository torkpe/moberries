import axios from 'axios';


export async function getPlans() {
  const response = await axios({
    url: 'https://cloud-storage-prices-moberries.herokuapp.com/prices',
  });
  return response.data?.subscription_plans;
}

export async function subscribeToPlan(data) {
  const response = await axios({
    url: 'https://httpbin.org/post',
    data,
    method: 'post'
  });
  return response.data;
}