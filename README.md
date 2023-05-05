# useMarketo

Best of all worlds marketo form hook

- Allows for full styling of native forms, (no need to use marketo styled forms!)
- Callback rich enviroment
- Ajax submissions (no refresh on marketo.submit)
- Tracked changes with normalized event triggers for handling data updates and submit
- removes duplicate id bugs from makreto forms (html validation rejoice)
- Removes supurflous styles from marketo forms

Marketo hook that merged the best parts of https://paulie.dev/posts/2022/12/how-to-create-custom-marketo-forms-with-react/ hook and the progenitor of both of ours https://github.com/charliedieter/react-marketo-hook.

Offers onLoadedCallbacks, successCallbacks, ajax support (or not!), tracked values state object, universal onChangeHadler to update the dataValues, as well as submitTrigger to wrap the whole thing up!

## What is this?

Ok so marketo is a bit of a hassle to work with. Marketo requires a script injection, looks for a form with a with a specific, then loads global var into your DOM. You capture an instance of your form from the global scope. This is a bit of a headache, and dont even get me started about multiple instances of forms on the page!
Talk about 2011.

Well this hook does it all each hook returns its own instance and helpfully only loads the script once.

Lets get started!

## Getting started

We still are required to add an instance of the forms respetive marketo ID. SO in the instance of the hook you'll need to add an id and include a ref of that form to the hook.

```
const MarketoForm = () => {
  const { inputValues, _handleChange, form, isSuccess, isReadyToSubmit } =
    useMarketo({
      formId: 123456,   // form id -> provided by marketo!
      formRef,          // formRef -> this form is for matketo
      isAjax: true,     // optional ajax submit
    })
  const formRef = useRef(null)
  return (
    <div>
      <form ref={formRef} />
    </div>
  )
}
```

Thats it! Lets go over the hook features

- inputValues: this is the value state of all the marketo form values
- isSuccess: react state boolean.
- isReadyToSubmit: react state boolean, tracking all the required fields
- form: this is the the marketo form instance, the whole enchalada. Usually wont be needed but if you need to manually
- \_handleChange: this is the change value trigger it follows this pattern `_handleChange(id, value)`, this will update the id of the target input in `inputValues`
  trigger thigns with the marketoAPI this is how you'd do it
