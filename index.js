import { useState, useEffect } from 'react'

const useMarketo = ({
  formId,
  formRef,
  successCallback,
  isAjax,
  marketoId,
  marketoEnv,
}) => {
  const [scriptAdded, setScriptAdded] = useState(false)
  const [formLoaded, setFormLoaded] = useState(false)
  const [inputValues, setInputValues] = useState(null)
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [form, setForm] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (scriptAdded) {
      if (!formLoaded) {
        MktoForms2.loadForm(
          `//${marketoEnv}`,
          marketoId,
          parseInt(formId),
          () => {
            // se the id of the form for marketo to grab it
            if (formRef.current) {
              formRef.current.id = `mktoForm_${formId}`
            }
            const mkForm = window.MktoForms2.getForm(formId)
            const values = mkForm.getValues()
            setInputValues(values)
            setForm(mkForm)

            // remove the form id so marketo doesnt error out on multi form pages
            if (formRef.current) {
              formRef.current.id = ''
            }

            mkForm.onSubmit(() => {
              setIsLoading(true)
            })

            // stop markeot redirect
            mkForm.onSuccess(() => {
              setIsLoading(false)
              setIsSuccess(true)
              if (successCallback) {
                successCallback()
              }

              if (isAjax) {
                return false
              }
            })
          }
        )
        MktoForms2.whenRendered((form) => {
          const formElement = form.getFormElem()[0]
          const formElementId = form.getFormElem()[0].id.split('_')[1]

          /** Remove the style attribute and make for, and id attributes unique */
          Array.from(formElement.querySelectorAll('[style]'))
            .concat(formElement)
            .forEach((element) => {
              element.removeAttribute('style')
              if (element.hasAttribute('id') && element.tagName !== 'FORM') {
                element.setAttribute(
                  'id',
                  `${element.getAttribute('id')}_${formElementId}`
                )
              }

              if (element.tagName === 'LABEL') {
                element.setAttribute(
                  'for',
                  `${element.getAttribute('for')}_${formElementId}`
                )
              }
            })

          /** Remove <span /> from DOM */
          Array.from(formElement.querySelectorAll('.mktoInstruction')).forEach(
            (element) => {
              element.remove()
            }
          )

          /** Remove <style /> from DOM */
          Array.from(formElement.children).forEach((element) => {
            if (element.type && element.type === 'text/css') {
              element.remove()
            }
          })
        })
        setFormLoaded(true)
      }
    } else {
      if (window.MktoForms2) {
        setScriptAdded(true)
      } else {
        const script = document.createElement('script')
        script.defer = true
        script.onload = () => (window?.MktoForms2 ? setScriptAdded(true) : null)
        script.src = `//${marketoEnv}/js/forms2/js/forms2.min.js`
        document.head.appendChild(script)
      }
    }
  }, [scriptAdded])

  useEffect(() => {
    if (form) {
      form.vals(inputValues)
      setIsReadyToSubmit(form.validate())
    }
  }, [form, inputValues])

  const _handleChange = (id, value) => {
    setInputValues((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const _handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    if (!isReadyToSubmit) {
      return
    }

    if (form.validate()) {
      form.submit()
    }
  }

  return {
    inputValues,
    _handleChange,
    _handleSubmit,
    form,
    isSuccess,
    isLoading,
    isReadyToSubmit,
  }
}

export default useMarketo
