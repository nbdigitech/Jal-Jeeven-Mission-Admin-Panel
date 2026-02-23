"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddDealerModal({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  const [step, setStep] = React.useState(1)
  const [focusedField, setFocusedField] = React.useState<string | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-3xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Dealer
          </DialogTitle>
        </DialogHeader>

        {/* ===== Step Indicator ===== */}
        <div className="flex items-center justify-between mt-4 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${step >= s ? "bg-[#136FB6] text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {s}
              </div>
              {s !== 3 && (
                <div
                  className={`flex-1 h-[2px] mx-2
                  ${step > s ? "bg-[#136FB6]" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-700">Personal Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "dealerName" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Dealer Name</label>
                  <Input 
                    placeholder="Enter dealer name" 
                    className={`w-full border-2 transition ${
                      focusedField === "dealerName" ? "!border-[#136FB6]" : "!border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("dealerName")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "phone" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Phone No.</label>
                  <Input 
                    placeholder="9405005285" 
                    className={`w-full border-2 transition ${
                      focusedField === "phone" ? "!border-[#136FB6]" : "!border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "email" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>E-Mail</label>
                  <Input 
                    placeholder="dealer@gmail.com" 
                    className={`w-full border-2 transition ${
                      focusedField === "email" ? "!border-[#136FB6]" : "!border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "password" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Password</label>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    className={`w-full border-2 transition ${
                      focusedField === "password" ? "!border-[#136FB6]" : "!border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "dob" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>DOB</label>
                  <Input 
                    placeholder="DD/MM/YYYY" 
                    type="date" 
                    className={`w-full border-2 transition ${
                      focusedField === "dob" ? "!border-[#136FB6]" : "!border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("dob")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                className="bg-[#136FB6] hover:bg-[#105E9A] text-white px-12"
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-700">Organization Detail</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "orgName" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Organization Name</label>
                  <Input 
                    placeholder="Rahul Traders" 
                    className={`w-full border-2 transition ${
                      focusedField === "orgName" ? "border-[#136FB6]" : "border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("orgName")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "logo" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Upload Logo</label>
                  <Input 
                    type="file" 
                    className={`w-full border-2 transition ${
                      focusedField === "logo" ? "border-[#136FB6]" : "border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("logo")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "gst" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Upload GST</label>
                  <Input 
                    type="file" 
                    placeholder="Choose file" 
                    className={`w-full border-2 transition ${
                      focusedField === "gst" ? "border-[#136FB6]" : "border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("gst")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "pancard" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Upload Pan Card</label>
                  <Input 
                    type="file" 
                    placeholder="Choose file" 
                    className={`w-full border-2 transition ${
                      focusedField === "pancard" ? "border-[#136FB6]" : "border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("pancard")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "aadhar" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Upload Aadhar</label>
                  <Input 
                    type="file" 
                    placeholder="Choose file" 
                    className={`w-full border-2 transition ${
                      focusedField === "aadhar" ? "border-[#136FB6]" : "border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("aadhar")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                className="border-[#136FB6]/30 text-[#105E9A] hover:bg-[#136FB6]/5 px-8"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="bg-[#136FB6] hover:bg-[#105E9A] text-white px-12"
                onClick={() => setStep(3)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-700">Address</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "state" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>State</label>
                  <Select onOpenChange={(open) => {
                    if (open) setFocusedField("state");
                    else setFocusedField(null);
                  }}>
                    <SelectTrigger className={`w-full border-2 transition ${
                      focusedField === "state" ? "border-[#136FB6]" : "border-gray-300"
                    }`}>
                      <SelectValue placeholder="Chhattisgarh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cg">Chhattisgarh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "district" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>District</label>
                  <Select onOpenChange={(open) => {
                    if (open) setFocusedField("district");
                    else setFocusedField(null);
                  }}>
                    <SelectTrigger className={`w-full border-2 transition ${
                      focusedField === "district" ? "border-[#136FB6]" : "border-gray-300"
                    }`}>
                      <SelectValue placeholder="Raipur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raipur">Raipur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "city" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>City</label>
                  <Select onOpenChange={(open) => {
                    if (open) setFocusedField("city");
                    else setFocusedField(null);
                  }}>
                    <SelectTrigger className={`w-full border-2 transition ${
                      focusedField === "city" ? "border-[#136FB6]" : "border-gray-300"
                    }`}>
                      <SelectValue placeholder="Raipur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raipur">Raipur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "location" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Location</label>
                  <Input 
                    placeholder="Sankle Nagar" 
                    className={`w-full border-2 transition ${
                      focusedField === "location" ? "border-[#136FB6]" : "border-gray-300"
                    }`}
                    onFocus={() => setFocusedField("location")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-2 transition ${
                    focusedField === "areaIncharge" ? "text-[#136FB6]" : "text-gray-700"
                  }`}>Select Area Incharge</label>
                  <Select onOpenChange={(open) => {
                    if (open) setFocusedField("areaIncharge");
                    else setFocusedField(null);
                  }}>
                    <SelectTrigger className={`w-full border-2 transition ${
                      focusedField === "areaIncharge" ? "border-[#136FB6]" : "border-gray-300"
                    }`}>
                      <SelectValue placeholder="Ajay Yadav" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ajay">Ajay Yadav</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                className="border-[#136FB6]/30 text-[#105E9A] hover:bg-[#136FB6]/5 px-8"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button className="bg-[#136FB6] hover:bg-[#105E9A] text-white px-12">
                Submit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


