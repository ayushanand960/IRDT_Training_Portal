def replace_placeholders(paragraph, replacements):
    if paragraph is None:
        return

    for key, value in replacements.items():
        if key in paragraph.text:
            inline = paragraph.runs
            for i in range(len(inline)):
                if key in inline[i].text:
                    inline[i].text = inline[i].text.replace(key, value)
