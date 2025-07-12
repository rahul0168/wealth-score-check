// @ts-nocheck
import { useEffect, useState } from "react";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Button } from "./components/ui/button";
import { AssetTable } from "./table";
import { toast } from "./components/ui/use-toast";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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

  const TOTAL = Number(goals) + Number(marketReaction) + Number(fallComfort);
  const RISK = evaluateTotal(TOTAL);
  const overallArray = Object.values(userInput);
  const totalOverall = overallArray.reduce((acc, current) => acc + current, 0);


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

      // Prepare the email data
      const emailData = {
        name,
        dob: dob ? dob.toISOString().split('T')[0] : null,
        age,
        anniversary: anniversary ? anniversary.toISOString().split('T')[0] : null,
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
        fd_overall: userInput.FD || 0,
        gold_overall: userInput.Gold || 0,
        debt_mf_overall: userInput["Debt Schemes"] || 0,
        equity_overall: userInput.Equity || 0,
        equity_mf_overall: userInput["Mutual Fund"] || 0,
        insurance_overall: userInput.Insurance || 0,
        aif_overall: userInput.AIF || 0,
        real_estate_overall: userInput["Real Estate"] || 0,
      };

      // Send email via backend API
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Form Submitted",
          description: "Your form has been submitted successfully",
        });
        setTimeout(() => {
          reset();
        }, 1000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while submitting the form",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
