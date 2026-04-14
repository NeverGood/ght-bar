import React from "react";

import AccessShell from "@/components/access-shell";

import Form from "./form";

export default function SignUp() {
    return (
        <AccessShell
            eyebrow="private access"
            panelEyebrow="sign up"
            panelTitle="Регистрация доступа"
            title="ghT Mini Bar"
        >
            <Form />
        </AccessShell>
    );
}
