// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Button } from "./components/ui/button";
import { AssetTable } from "./table";
import { toast } from "./components/ui/use-toast";

import emailjs from "@emailjs/browser";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAAgIulOnwHPfZQBrV5_MLIZFVlFfyHV8",
  authDomain: "ashiyana-3aa66.firebaseapp.com",
  projectId: "ashiyana-3aa66",
  storageBucket: "ashiyana-3aa66.appspot.com",
  messagingSenderId: "148563676606",
  appId: "1:148563676606:web:95379b44b674eeb36efdef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const LONG_TERM = 30;
const SHORT_TERM = 10;
const MEDIUM_TERM = 20;
const BUY = 30;
const HOLD = 20;
const SELL = 10;
const TEN_PERCENT = 10;
const TWENTY_PERCENT = 20;
const THIRTY_PERCENT = 30;

// Returns a risk label based on the summed points of the three risk-profiling questions.
// The bounds are strictly greater than the lower limit and strictly less than the
// upper limit, per the specification provided:
//   >30 <50 → Moderate
//   >50 <60 → Medium
//   >60 <90 → High
function evaluateTotal(total: number) {
  if (total > 30 && total <= 50) return "Moderate";
  if (total > 50 && total <= 60) return "Medium";
  if (total > 60 && total <= 90) return "High";
  return "";
}

const App = () => {
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const [userInput, setUserInput] = useState({
    FD: 0,
    Gold: 0,
    "Debt Schemes": 0,
    Equity: 0,
    "Mutual Fund": 0,
    Insurance: 0,
    AIF: 0,
    "Real Estate": 0,
  });
  const [loading, setLoading] = useState(false);
  const [overAllTotalContri, setOverAllTotalContri] = useState(0);
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [age, setAge] = useState("");
  const [anniversary, setAnniversary] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [income, setIncome] = useState("");
  const [goals, setGoals] = useState("");
  const [marketReaction, setMarketReaction] = useState("");
  const [fallComfort, setFallComfort] = useState("");
  const [readAndUnderstood, setReadAndUnderstood] = useState("Yes");
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef(null);
  const TOTAL = Number(goals) + Number(marketReaction) + Number(fallComfort);
  const RISK = evaluateTotal(TOTAL);
  const overallArray = Object.values(userInput);
  const totalOverall = overallArray.reduce((acc, current) => acc + current, 0);

  const handleSignatureChange = (e) => {
    if (e.target.files[0]) {
      setSignature(e.target.files[0]);
    }
  };
  const emailToSend = ["anirudh@ashianafinserve.com", email];
  // const emailToSend = ["eagleofnile27@gmail.com", email];
  const isFormValid = () => {
    return (
      name &&
      email &&
      phone &&
      goals &&
      marketReaction &&
      fallComfort &&
      readAndUnderstood === "Yes"
    );
  };

  useEffect(() => {
    if (dob) {
      const ageDiff = new Date(today - new Date(dob));
      setAge(Math.abs(ageDiff.getUTCFullYear() - 1970));
    }
  }, [dob]);

  const reset = () => {
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);



    try {
      if (signature) {
        const signatureImageRef = ref(storage, `signatures/${signature.name}`);
        const uploadTask = uploadBytesResumable(signatureImageRef, signature);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error("Error uploading signature:", error);
            toast({
              title: "Error",
              description: "An error occurred while uploading the signature",
              variant: "destructive",
            });
          },
          async () => {
            // Handle successful uploads on complete
            // Get the download URL
            const signatureUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Signature URL:", signatureUrl);

            let verdict = "";

            if (overAllTotalContri >= 5 && overAllTotalContri <= 10) {
              verdict =
                "5-10%: need to re-allocate and review with an advisor as you are not beating inflation.";
            } else if (overAllTotalContri > 10 && overAllTotalContri <= 15) {
              verdict =
                "10-15%: need to evaluate risk reward in favor of reward";
            } else if (overAllTotalContri > 15 && overAllTotalContri <= 20) {
              verdict = "15-20%: need to rebalance portfolio";
            }

            const contactInfo =
              "To talk to an expert connect at +91 9930181344";

            // Prepare the email template parameters
            const templateParams = {
              name,
              dob,
              age,
              anniversary,
              email,
              phone,
              income,
              goals,
              marketReaction,
              fallComfort,
              readAndUnderstood,
              signatureUrl,
              risk: RISK,
              overAllTotalContri,
              verdict,
              contactInfo,
            };
            try {
              await Promise.all(
                emailToSend.map(async (item) => {
                  console.log({ ...templateParams, to_email: item });
                  // Send email using EmailJS
                  await emailjs.send(
                    "service_hg510uy",
                    "template_ashiana",
                    { ...templateParams, to_email: item },

                    {
                      publicKey: "1t9pPCXbTAud-vC4x",
                    }
                  );
                })
              );
            } catch (err) {
              console.log(err);
            }

            toast({
              title: "Form Submitted",
              description: "Your form has been submitted successfully",
            });
            setTimeout(() => {
              reset();
            }, 1000);
          }
        );
        return;
      }

      let verdict = "";

      if (overAllTotalContri >= 5 && overAllTotalContri <= 10) {
        verdict =
          "5-10%: need to re-allocate and review with an advisor as you are not beating inflation.";
      } else if (overAllTotalContri > 10 && overAllTotalContri <= 15) {
        verdict = "10-15%: need to evaluate risk reward in favor of reward";
      } else if (overAllTotalContri > 15 && overAllTotalContri <= 20) {
        verdict = "15-20%: need to rebalance portfolio";
      }

      const contactInfo = "To talk to an expert connect at +91 9930181344";

      // Prepare the email template parameters
      const templateParams = {
        name,
        dob,
        age,
        anniversary,
        email,
        phone,
        income,
        goals,
        marketReaction,
        fallComfort,
        readAndUnderstood,
        risk: RISK,
        overAllTotalContri: Number(overAllTotalContri.toFixed(2)),
        verdict,
        contactInfo,
        fd_overall: userInput.FD,
        gold_overall: userInput.Gold,
        debt_mf_overall: userInput["Debt Schemes"],
        equity_overall: userInput.Equity,
        equity_mf_overall: userInput["Mutual Fund"],
        insurance_overall: userInput.Insurance,
        aif_overall: userInput.AIF,
        real_estate_overall: userInput["Real Estate"],
      };
      try {
        await Promise.all(
          emailToSend.map(async (item) => {
            console.log({ ...templateParams, to_email: item });
            // Send email using EmailJS
            await emailjs.send(
              "service_5y0g2rg",
              "template_ashiana",
              { ...templateParams, to_email: item },

              {
                publicKey: "1t9pPCXbTAud-vC4x",
              }
            );
          })
        );
      } catch (err) {
        console.log(err);
      }

      toast({
        title: "Form Submitted",
        description: "Your form has been submitted successfully",
      });
      setTimeout(() => {
        reset();
      }, 1000);
      // Upload signature image to Firebase storage
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the form",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row items-start gap-10 px-4 lg:px-20 py-5 lg:py-20">
        <div className="flex border rounded-lg p-6 flex-col gap-4 items-center justify-center w-[100%] lg:w-[50%] mx-auto">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="name">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="dob">Date of Birth</Label>
            <DatePicker
              id="dob"
              size="lg"
              className="w-full"
              value={dob}
              onChange={(date) => setDob(date)}
              shouldDisableDate={(date) => date > eighteenYearsAgo}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              disabled
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-2 flex-col">
            <Label htmlFor="anniversary">Anniversary</Label>
            <DatePicker
              id="anniversary"
              size="lg"
              className="w-full"
              value={anniversary}
              onChange={(date) => setAnniversary(date)}
            />
          </div>
          <div className="w-full flex gap-2 flex-col">
            <Label htmlFor="email">
              Email<span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-2 flex-col">
            <Label htmlFor="phone">
              Mobile<span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-2 flex-col">
            <Label htmlFor="income">Annual Income</Label>
            <Input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-2 flex-col">
            <RadioGroup
              className="w-full"
              value={goals}
              onValueChange={setGoals}
            >
              <Label>
                What are your key financial goals-short term and long term?
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SHORT_TERM} id="r1" />
                  <Label htmlFor="t1">Short Term</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={MEDIUM_TERM} id="r2" />
                  <Label htmlFor="t2">Medium Term</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={LONG_TERM} id="r3" />
                  <Label htmlFor="t3">Long Term</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          <RadioGroup
            className="w-full"
            value={marketReaction}
            onValueChange={setMarketReaction}
          >
            <Label className="mb-2">
              What is your reaction when the market falls?
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={BUY} id="r1" />
                <Label htmlFor="m1">Buy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={HOLD} id="r2" />
                <Label htmlFor="m2">Hold</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={SELL} id="r3" />
                <Label htmlFor="m3">Sell</Label>
              </div>
            </div>
          </RadioGroup>
          <RadioGroup
            value={fallComfort}
            className="w-full"
            onValueChange={setFallComfort}
          >
            <Label className="mb-2">
              What degree of fall are you comfortable with?
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={TEN_PERCENT} id="r1" />
                <Label htmlFor="p1">10</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={TWENTY_PERCENT} id="r2" />
                <Label htmlFor="p2">20</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={THIRTY_PERCENT} id="r3" />
                <Label htmlFor="p3">30</Label>
              </div>
            </div>
          </RadioGroup>
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="risk">Risk Profile:</Label>
            <Input id="risk" disabled value={RISK} />
          </div>

          {/* <div className="flex w-full flex-col gap-2">
          <Label htmlFor="signature">Signature(Optional)</Label>
          <Input
            id="signature"
            type="file"
            accept="image/*"
            ref={signatureRef}
            onChange={handleSignatureChange}
          />
        </div> */}
          {/* <DatePicker disabled size="lg" className="w-full" value={new Date()} /> */}
          {/* <div className="mt-5 hidden md:flex justify-center w-full gap-4">
        <RadioGroup
          value={readAndUnderstood}
          onValueChange={setReadAndUnderstood}
          className="flex  items-center"
        >
          <Label className="">I have read and understood</Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="r1" />
              <Label htmlFor="r1">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="r2" />
              <Label htmlFor="r2">No</Label>
            </div>
          </div>
        </RadioGroup>
        <Button variant={"outline"} onClick={() => reset()}>
          Clear All
        </Button>
        <Button disabled={!isFormValid() || loading} onClick={handleSubmit}>
          {loading ? "Submitting.." : "Submit"}
        </Button>
      </div> */}
        </div>
        <div className="flex w-full lg:w-[50%] flex-col">
          <AssetTable
            overAllTotalContri={overAllTotalContri}
            setOverAllTotalContri={setOverAllTotalContri}
            userInput={userInput}
            setUserInput={setUserInput}
            overallArray={overallArray}
            totalOverall={totalOverall}
          />
          <div className="mt-20  items-center hidden lg:flex flex-col justify-center w-full gap-4">
            <RadioGroup
              value={readAndUnderstood}
              onValueChange={setReadAndUnderstood}
              className="flex  items-center"
            >
              <Label className="">I have read and understood</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="r1" />
                  <Label htmlFor="r1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="r2" />
                  <Label htmlFor="r2">No</Label>
                </div>
              </div>
            </RadioGroup>
            <div className="flex gap-4">
              <Button variant={"outline"} onClick={() => reset()}>
                Clear All
              </Button>
              <Button
                disabled={!isFormValid() || loading}
                onClick={handleSubmit}
              >
                {loading ? "Submitting.." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="my-8 lg:hidden items-center flex flex-col justify-center w-full gap-4">
        <RadioGroup
          value={readAndUnderstood}
          onValueChange={setReadAndUnderstood}
          className="flex  items-center"
        >
          <Label className="">I have read and understood</Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="r1" />
              <Label htmlFor="r1">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="r2" />
              <Label htmlFor="r2">No</Label>
            </div>
          </div>
        </RadioGroup>
        <div className="flex gap-4">
          <Button variant={"outline"} onClick={() => reset()}>
            Clear All
          </Button>
          <Button disabled={!isFormValid() || loading} onClick={handleSubmit}>
            {loading ? "Submitting.." : "Submit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default App;
