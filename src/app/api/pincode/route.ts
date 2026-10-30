import { NextRequest, NextResponse } from 'next/server';

// Common Indian Pincode prefix map for instant offline detection and fallback
const PINCODE_PREFIX_MAP: Record<string, { city: string; state: string }> = {
  // Delhi NCR
  '110': { city: 'New Delhi', state: 'Delhi' },
  '121': { city: 'Faridabad', state: 'Haryana' },
  '122': { city: 'Gurugram', state: 'Haryana' },
  '201': { city: 'Noida', state: 'Uttar Pradesh' },

  // Rajasthan
  '301': { city: 'Alwar', state: 'Rajasthan' },
  '302': { city: 'Jaipur', state: 'Rajasthan' },
  '303': { city: 'Jaipur Rural', state: 'Rajasthan' },
  '304': { city: 'Tonk', state: 'Rajasthan' },
  '305': { city: 'Ajmer', state: 'Rajasthan' },
  '306': { city: 'Pali', state: 'Rajasthan' },
  '307': { city: 'Sirohi', state: 'Rajasthan' },
  '311': { city: 'Bhilwara', state: 'Rajasthan' },
  '312': { city: 'Chittorgarh', state: 'Rajasthan' },
  '313': { city: 'Udaipur', state: 'Rajasthan' },
  '314': { city: 'Dungarpur', state: 'Rajasthan' },
  '321': { city: 'Bharatpur', state: 'Rajasthan' },
  '322': { city: 'Sawai Madhopur', state: 'Rajasthan' },
  '324': { city: 'Kota', state: 'Rajasthan' },
  '325': { city: 'Baran', state: 'Rajasthan' },
  '326': { city: 'Jhalawar', state: 'Rajasthan' },
  '331': { city: 'Churu', state: 'Rajasthan' },
  '332': { city: 'Sikar', state: 'Rajasthan' },
  '333': { city: 'Jhunjhunu', state: 'Rajasthan' },
  '334': { city: 'Bikaner', state: 'Rajasthan' },
  '335': { city: 'Sri Ganganagar', state: 'Rajasthan' },
  '341': { city: 'Nagaur', state: 'Rajasthan' },
  '342': { city: 'Jodhpur', state: 'Rajasthan' },
  '343': { city: 'Jalore', state: 'Rajasthan' },
  '344': { city: 'Barmer', state: 'Rajasthan' },
  '345': { city: 'Jaisalmer', state: 'Rajasthan' },

  // Maharashtra
  '400': { city: 'Mumbai', state: 'Maharashtra' },
  '401': { city: 'Thane', state: 'Maharashtra' },
  '410': { city: 'Lonavala', state: 'Maharashtra' },
  '411': { city: 'Pune', state: 'Maharashtra' },
  '412': { city: 'Pune Rural', state: 'Maharashtra' },
  '414': { city: 'Ahmednagar', state: 'Maharashtra' },
  '416': { city: 'Kolhapur', state: 'Maharashtra' },
  '421': { city: 'Kalyan', state: 'Maharashtra' },
  '422': { city: 'Nashik', state: 'Maharashtra' },
  '431': { city: 'Chhatrapati Sambhaji Nagar', state: 'Maharashtra' },
  '440': { city: 'Nagpur', state: 'Maharashtra' },
  '444': { city: 'Amravati', state: 'Maharashtra' },

  // Karnataka
  '560': { city: 'Bengaluru', state: 'Karnataka' },
  '562': { city: 'Bengaluru Rural', state: 'Karnataka' },
  '570': { city: 'Mysuru', state: 'Karnataka' },
  '575': { city: 'Mangaluru', state: 'Karnataka' },
  '580': { city: 'Hubballi', state: 'Karnataka' },

  // Telangana & Andhra Pradesh
  '500': { city: 'Hyderabad', state: 'Telangana' },
  '501': { city: 'Ranga Reddy', state: 'Telangana' },
  '502': { city: 'Medak', state: 'Telangana' },
  '506': { city: 'Warangal', state: 'Telangana' },
  '520': { city: 'Vijayawada', state: 'Andhra Pradesh' },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '517': { city: 'Tirupati', state: 'Andhra Pradesh' },

  // Tamil Nadu
  '600': { city: 'Chennai', state: 'Tamil Nadu' },
  '603': { city: 'Kanchipuram', state: 'Tamil Nadu' },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '625': { city: 'Madurai', state: 'Tamil Nadu' },
  '620': { city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  '636': { city: 'Salem', state: 'Tamil Nadu' },

  // Gujarat
  '380': { city: 'Ahmedabad', state: 'Gujarat' },
  '382': { city: 'Gandhinagar', state: 'Gujarat' },
  '390': { city: 'Vadodara', state: 'Gujarat' },
  '395': { city: 'Surat', state: 'Gujarat' },
  '360': { city: 'Rajkot', state: 'Gujarat' },
  '361': { city: 'Jamnagar', state: 'Gujarat' },
  '364': { city: 'Bhavnagar', state: 'Gujarat' },

  // West Bengal
  '700': { city: 'Kolkata', state: 'West Bengal' },
  '711': { city: 'Howrah', state: 'West Bengal' },
  '734': { city: 'Siliguri', state: 'West Bengal' },

  // Uttar Pradesh
  '226': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '208': { city: 'Kanpur', state: 'Uttar Pradesh' },
  '221': { city: 'Varanasi', state: 'Uttar Pradesh' },
  '282': { city: 'Agra', state: 'Uttar Pradesh' },
  '211': { city: 'Prayagraj', state: 'Uttar Pradesh' },
  '250': { city: 'Meerut', state: 'Uttar Pradesh' },
  '243': { city: 'Bareilly', state: 'Uttar Pradesh' },
  '273': { city: 'Gorakhpur', state: 'Uttar Pradesh' },

  // Madhya Pradesh
  '452': { city: 'Indore', state: 'Madhya Pradesh' },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '482': { city: 'Jabalpur', state: 'Madhya Pradesh' },
  '474': { city: 'Gwalior', state: 'Madhya Pradesh' },
  '456': { city: 'Ujjain', state: 'Madhya Pradesh' },

  // Punjab, Haryana & Chandigarh
  '160': { city: 'Chandigarh', state: 'Chandigarh' },
  '141': { city: 'Ludhiana', state: 'Punjab' },
  '143': { city: 'Amritsar', state: 'Punjab' },
  '144': { city: 'Jalandhar', state: 'Punjab' },
  '134': { city: 'Panchkula', state: 'Haryana' },
  '133': { city: 'Ambala', state: 'Haryana' },

  // Uttarakhand & Himachal
  '248': { city: 'Dehradun', state: 'Uttarakhand' },
  '249': { city: 'Haridwar / Rishikesh', state: 'Uttarakhand' },
  '171': { city: 'Shimla', state: 'Himachal Pradesh' },

  // Bihar & Jharkhand
  '800': { city: 'Patna', state: 'Bihar' },
  '834': { city: 'Ranchi', state: 'Jharkhand' },
  '831': { city: 'Jamshedpur', state: 'Jharkhand' },

  // Odisha
  '751': { city: 'Bhubaneswar', state: 'Odisha' },
  '753': { city: 'Cuttack', state: 'Odisha' },

  // Kerala
  '682': { city: 'Kochi', state: 'Kerala' },
  '695': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '673': { city: 'Kozhikode', state: 'Kerala' },

  // Assam & Northeast
  '781': { city: 'Guwahati', state: 'Assam' },

  // Goa
  '403': { city: 'Panaji', state: 'Goa' },
};

export async function GET(req: NextRequest) {
  try {
    const rawCode = req.nextUrl.searchParams.get('pincode') || '';
    const pincode = rawCode.replace(/\D/g, '').slice(0, 6);

    if (pincode.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Pincode must be exactly 6 digits' },
        { status: 400 }
      );
    }

    const prefix3 = pincode.slice(0, 3);
    const prefixFallback = PINCODE_PREFIX_MAP[prefix3];

    // Try online Postal API with a strict 2.5s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const detectedCity = po.District || po.Block || po.Division || prefixFallback?.city || '';
          const detectedState = po.State || prefixFallback?.state || '';
          const detectedArea = po.Name || '';

          if (detectedCity) {
            return NextResponse.json({
              success: true,
              city: detectedCity,
              state: detectedState,
              area: detectedArea,
              source: 'postal_api',
            });
          }
        }
      }
    } catch {
      // If external API times out or fails, fallback gracefully to offline directory
    }

    // Fallback to offline prefix directory if external API failed or timed out
    if (prefixFallback) {
      return NextResponse.json({
        success: true,
        city: prefixFallback.city,
        state: prefixFallback.state,
        area: '',
        source: 'local_prefix',
      });
    }

    // Default fallback
    return NextResponse.json({
      success: false,
      error: 'City not automatically detected for this pincode',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to lookup pincode' }, { status: 500 });
  }
}
