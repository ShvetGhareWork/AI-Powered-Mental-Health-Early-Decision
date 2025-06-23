"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConsentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export function ConsentModal({ open, onOpenChange, onAccept }: ConsentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service & Privacy Policy</DialogTitle>
          <DialogDescription>Please read and accept our terms and privacy policy to continue.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">Privacy Policy</h3>
              <p className="mb-2">
                At MindGuard, we take your privacy seriously. This policy explains how we collect, use, and protect your
                personal information.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We collect only necessary information for providing mental health services</li>
                <li>Your data is encrypted and stored securely</li>
                <li>We never share your personal information without consent</li>
                <li>You can request data deletion at any time</li>
                <li>Anonymous options are available for sensitive assessments</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Data Collection</h3>
              <p className="mb-2">We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Account information (name, email, role)</li>
                <li>Mental health assessment responses</li>
                <li>Chat conversations with our AI system</li>
                <li>Usage analytics (anonymized)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">AI Analysis</h3>
              <p className="mb-2">
                Our AI system analyzes your input to provide mental health insights. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Sentiment analysis of text input</li>
                <li>Risk assessment based on responses</li>
                <li>Personalized recommendations</li>
                <li>Crisis detection and intervention</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Terms of Service</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  This platform is for informational purposes and not a substitute for professional medical advice
                </li>
                <li>In case of emergency, contact local emergency services immediately</li>
                <li>Users must be 18+ or have parental consent</li>
                <li>Misuse of the platform may result in account termination</li>
                <li>We reserve the right to update these terms with notice</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Crisis Intervention</h3>
              <p>If our AI detects signs of immediate risk, we may:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide immediate crisis resources</li>
                <li>Connect you with emergency services</li>
                <li>Notify designated emergency contacts (if provided)</li>
                <li>Alert our crisis intervention team</li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAccept}>Accept & Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
