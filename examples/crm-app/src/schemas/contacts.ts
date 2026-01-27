import { PageSchema } from "@object-ui/types";

export const contactListSchema: PageSchema = {
    type: "page",
    props: { title: "Contacts" },
    children: [
        {
            type: "page:header",
            props: {
                title: "Contacts",
                description: "Manage your customers and leads"
            },
            children: [
                {
                    type: "action:button",
                    props: { label: "New Contact", variant: "default" },
                    events: { onClick: [{ action: "navigate", params: { url: "/contacts/new" } }] }
                }
            ]
        },
        {
            type: "page:card",
            className: "mt-4",
            children: [
                {
                    type: "view:grid",
                    bind: "contacts",
                    props: {
                        columns: [
                            { key: "name", label: "Name", type: "text" },
                            { key: "company", label: "Company", type: "text" },
                            { key: "email", label: "Email", type: "email" },
                            { key: "status", label: "Status", type: "badge" },
                            {
                                key: "actions", label: "Actions", type: "action:group",
                                render: (row: any) => ({
                                    actions: [
                                        { label: "View", action: "navigate", params: { url: `/contacts/${row.id}` } }
                                    ]
                                })
                            }
                        ]
                    }
                }
            ]
        }
    ]
};

export const contactDetailSchema: PageSchema = {
    type: "page",
    props: { title: "Contact Details" },
    children: [
        {
            type: "page:header",
            props: {
                title: "${data.name}", // Expression binding
                description: "${data.title} at ${data.company}"
            },
            children: [
                {
                    type: "action:button",
                    props: { label: "Edit", variant: "outline" }
                },
                {
                    type: "action:button",
                    props: { label: "Delete", variant: "destructive" }
                }
            ]
        },
        {
            type: "view:simple", // Form view
            props: {
                columns: 2
            },
            children: [
                { type: "field:text", bind: "name", props: { label: "Full Name", readonly: true } },
                { type: "field:email", bind: "email", props: { label: "Email Address", readonly: true } },
                { type: "field:phone", bind: "phone", props: { label: "Phone", readonly: true } },
                { type: "field:text", bind: "company", props: { label: "Company", readonly: true } },
                { type: "field:text", bind: "title", props: { label: "Job Title", readonly: true } },
                { type: "field:badge", bind: "status", props: { label: "Status" } }
            ]
        },
        {
            type: "page:tabs",
            className: "mt-6",
            props: {
                defaultValue: "activity",
                items: [
                    { value: "activity", label: "Activity" },
                    { value: "history", label: "History" }
                ]
            },
            children: [
               {
                 type: "record:activity",
                 props: { content: "Activity Timeline Placeholder" } 
               }
            ]
        }
    ]
};
