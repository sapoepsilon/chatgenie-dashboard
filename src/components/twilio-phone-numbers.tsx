"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Phone,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PurchaseNumberDialog } from "./purchase-number-dialog";
import { PhoneNumber } from "@/types/twilio/phoneNumbersTypes";
import { EditFriendlyNameDialog } from "./phoneNumbers/edit-friendly-name-dialog";

const TwilioPhoneNumbers = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleRow = (sid: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(sid)) {
      newExpandedRows.delete(sid);
    } else {
      newExpandedRows.add(sid);
    }
    setExpandedRows(newExpandedRows);
  };

  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch("/api/twilio/phone-numbers");
      if (!response.ok) {
        throw new Error("Failed to fetch phone numbers");
      }
      const data = await response.json();
      setPhoneNumbers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `There was a problem with ${error}`,
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePhoneNumber = async (sid: string) => {
    try {
      const response = await fetch(`/api/twilio/phone-numbers/${sid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete phone number");
      }

      toast({
        title: "Success",
        description: `Successfully deleted phone number with SID: ${sid}`,
      });
      fetchPhoneNumbers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `There was a problem with ${error}`,
      });
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Phone Numbers</span>
          <PurchaseNumberDialog onNumberPurchased={fetchPhoneNumbers} />
        </CardTitle>
        <CardDescription>
          Manage your Twilio phone numbers and their capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Friendly Name</TableHead>
              <TableHead>Capabilities</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phoneNumbers.map((number) => (
              <React.Fragment key={number.sid}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleRow(number.sid)}
                >
                  <TableCell>
                    {expandedRows.has(number.sid) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {number.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <span>{number.friendlyName}</span>
                    <EditFriendlyNameDialog
                      phoneNumber={number.phoneNumber}
                      sid={number.sid}
                      currentFriendlyName={number.friendlyName}
                      onUpdate={fetchPhoneNumbers}
                    />
                  </TableCell>{" "}
                  <TableCell>
                    <div className="flex gap-2">
                      {number.capabilities.voice && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Voice
                        </span>
                      )}
                      {number.capabilities.sms && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          SMS
                        </span>
                      )}
                      {number.capabilities.mms && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          MMS
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(number.dateCreated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePhoneNumber(number.sid);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.has(number.sid) && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="p-4 bg-muted/50 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Configuration
                            </h4>
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-sm font-medium">SID</dt>
                                <dd className="text-sm text-muted-foreground">
                                  {number.sid}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium">
                                  API Version
                                </dt>
                                <dd className="text-sm text-muted-foreground">
                                  {number.apiVersion || "Not set"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium">Status</dt>
                                <dd className="text-sm text-muted-foreground">
                                  {number.status || "Unknown"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Webhook URLs</h4>
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-sm font-medium">
                                  Voice URL
                                </dt>
                                <dd className="text-sm text-muted-foreground">
                                  {number.voiceUrl || "Not configured"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium">SMS URL</dt>
                                <dd className="text-sm text-muted-foreground">
                                  {number.smsUrl || "Not configured"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium">
                                  Address Requirements
                                </dt>
                                <dd className="text-sm text-muted-foreground">
                                  {number.addressRequirements || "None"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TwilioPhoneNumbers;
