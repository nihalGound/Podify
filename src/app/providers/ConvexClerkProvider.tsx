"use client"
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

const ConvexClerkProvider = ({children} : {children:ReactNode}) => (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    appearance={{
      layout:{
        socialButtonsVariant:"iconButton",
      },
      variables:{
        colorBackground:'#15171C',
        colorText:"#ffffff",
        colorPrimary:'',
        colorInputBackground:'#1B1F29',
        colorInputText:"#ffffff"
      },
    }}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
);

export default ConvexClerkProvider;
