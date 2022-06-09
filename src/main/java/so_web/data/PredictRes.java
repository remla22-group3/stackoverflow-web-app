package so_web.data;

import java.util.Arrays;
import java.util.Objects;

public class PredictRes {
	public final String title = null;
	public final String[] result = null;
	public Integer hash = null;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		PredictRes that = (PredictRes) o;

		if (!Objects.equals(title, that.title)) return false;
		return Arrays.equals(result, that.result);
	}

	@Override
	public int hashCode() {
		if (hash == null) {
			hash = title != null ? title.hashCode() : 0;
			hash = 31 * hash + Arrays.hashCode(result);
		}
		return hash;
	}
}
