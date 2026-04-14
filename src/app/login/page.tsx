import React from "react";

import AccessShell from "@/components/access-shell";

import LoginForm from "./form/form";

export default function Login() {
    return (
        <AccessShell
            eyebrow="private access"
            panelEyebrow="sign in"
            panelTitle="Вход в коллекцию"
            title="ghT Mini Bar"
        >
            <LoginForm />
        </AccessShell>
    );
}
