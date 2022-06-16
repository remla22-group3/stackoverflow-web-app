package so_web.ctrl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import so_web.data.SubmissionsCollection;

@Controller
@RequestMapping("/submissions")
public class SubmissionsController {

    public SubmissionsController() {
        super();
    }

    @GetMapping(produces = "text/plain")
    @ResponseBody
    public String submissions() {
        return SubmissionsCollection.documentsToTSV();
    }
}
