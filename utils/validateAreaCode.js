import axios from "axios";

export default async (value) => {
  try {
    // server returns 200 on valid areacode, 400 on incorrect
    await axios.get(`http://mapit.nuug.no/postcode/${value}`);

    return true;
  } catch (err) {
    throw new Error("Area code is not valid");
  }
};
