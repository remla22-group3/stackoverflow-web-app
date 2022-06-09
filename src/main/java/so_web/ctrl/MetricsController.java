package so_web.ctrl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import so_web.data.Metrics;

@Controller
@RequestMapping("/metrics")
public class MetricsController {

    public MetricsController() {
        super();
    }

    @GetMapping(produces = "text/plain")
    @ResponseBody
    public String metrics() {
        return Metrics.getInstance().toString();
    }
}
