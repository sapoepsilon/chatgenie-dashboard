// app/admin/page.tsx
import TwilioPhoneNumbers from "@/components/twilio-phone-numbers";
import OpenAIRealtime from "@/components/openai-realtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10 px-2">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <Tabs defaultValue="twilio" className="w-full">
        <TabsList>
          <TabsTrigger value="twilio">Twilio</TabsTrigger>
          <TabsTrigger value="openai">OpenAI Realtime</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="twilio">
          <TwilioPhoneNumbers />
        </TabsContent>

        <TabsContent value="openai">
          <OpenAIRealtime />
        </TabsContent>

        <TabsContent value="settings">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            {/* Add your settings content here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
