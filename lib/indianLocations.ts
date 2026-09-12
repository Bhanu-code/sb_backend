// lib/indianLocations.ts

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const

// Districts for the states most relevant to your current user base (West Bengal,
// where your company is registered) are complete. Other states are populated with
// their major/most populous districts to get you started — genuinely exhaustive
// district lists for all 36 states/UTs would roughly triple this file's size.
// Extend any state's array as real users from that region sign up.
export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur',
    'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong',
    'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas',
    'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur',
    'Purulia', 'South 24 Parganas', 'Uttar Dinajpur',
  ],
  'Maharashtra': [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik',
    'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Sangli',
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad',
    'Belagavi', 'Kalaburagi', 'Ballari', 'Shivamogga', 'Tumakuru',
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi',
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
    'Erode', 'Vellore', 'Thoothukudi', 'Dindigul',
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur Nagar', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut',
    'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Noida (Gautam Buddh Nagar)',
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
    'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad',
  ],
  'Telangana': [
    'Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Warangal Urban',
    'Nizamabad', 'Karimnagar', 'Khammam',
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar',
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia',
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur',
    'Kollam', 'Kannur', 'Palakkad', 'Malappuram',
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali',
  ],
  'Haryana': [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar',
  ],
  'Assam': [
    'Guwahati (Kamrup Metropolitan)', 'Dibrugarh', 'Silchar (Cachar)', 'Jorhat', 'Nagaon',
  ],
  'Odisha': [
    'Bhubaneswar (Khordha)', 'Cuttack', 'Rourkela (Sundargarh)', 'Berhampur (Ganjam)',
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain',
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur (East Singhbhum)', 'Dhanbad', 'Bokaro',
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai (Durg)', 'Bilaspur', 'Korba',
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Nellore', 'Tirupati (Chittoor)',
  ],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Chandigarh': ['Chandigarh'],
  'Goa': ['North Goa', 'South Goa'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar'],
  'Himachal Pradesh': ['Shimla', 'Kangra', 'Mandi', 'Solan'],
  'Tripura': ['West Tripura', 'Gomati', 'Sepahijala'],
  'Manipur': ['Imphal East', 'Imphal West'],
  'Meghalaya': ['East Khasi Hills', 'West Garo Hills'],
  'Nagaland': ['Kohima', 'Dimapur'],
  'Mizoram': ['Aizawl'],
  'Sikkim': ['East Sikkim', 'West Sikkim'],
  'Arunachal Pradesh': ['Papum Pare', 'East Siang'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Lakshadweep'],
  'Andaman and Nicobar Islands': ['South Andaman', 'North and Middle Andaman', 'Nicobar'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
}

export function getDistrictsForState(state: string): string[] {
  return DISTRICTS_BY_STATE[state] ?? []
}