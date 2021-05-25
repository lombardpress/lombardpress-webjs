export function getAvailableComponents(resourceType) {
    let showComponents = []
      switch (resourceType){
      case "collection":
        showComponents.push("textCitation")
        showComponents.push("textCompare")
        showComponents.push("comments")
        showComponents.push("search")
        break
      case "workGroup":
        showComponents.push("workGroupInfo")
        showComponents.push("comments")
        showComponents.push("search")
        break;
      case "person":
        showComponents.push("personInfo")
        showComponents.push("comments")
        showComponents.push("search")
        break;
      case "codex":
        showComponents.push("codex")
        showComponents.push("codexToc")
        showComponents.push("comments")
        showComponents.push("search")
        break;
      case "expressionType":
          showComponents.push("comments")
          showComponents.push("search")
          break;
      case "text":
        showComponents.push("textCitation")
        showComponents.push("textCompare")
        showComponents.push("comments")
        showComponents.push("search")
        showComponents.push("xml")
        showComponents.push("surface3")
        showComponents.push("textOutlineWrapper")
        break;
      default:
        break;
      }
      return showComponents
}