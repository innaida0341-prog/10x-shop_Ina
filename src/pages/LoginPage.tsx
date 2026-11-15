import type { ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormField } from "@/components/ui/FormField";
import { useAuth } from "@/context/AuthContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { isFromState } from "@/utils/guards";
import type { LoginFormValues } from "@/types/user";

const loginSchema = yup.object({
  username: yup.string().trim().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage(): ReactElement {
  useDocumentTitle("Log in");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = isFromState(location.state) ? location.state.from : "/";

  const formik = useFormik<LoginFormValues>({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values, helpers) => {
      login(values.username);
      helpers.setSubmitting(false);
      navigate(from, { replace: true });
    },
  });

  return (
    <div className="mx-auto grid w-full max-w-md animate-fade-up gap-5">
      <div className="card p-7 sm:p-9">
        <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-brand to-accent font-display font-bold text-white">10X</span>
        <h1 className="mt-5 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted">
          Demo login — any non-empty username and a password of at least 6 characters works.
        </p>

        <form onSubmit={formik.handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <FormField id="login-username" label="Username" error={formik.touched.username ? formik.errors.username : undefined}>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="emilys"
              aria-invalid={Boolean(formik.touched.username && formik.errors.username)}
              aria-describedby={formik.touched.username && formik.errors.username ? "login-username-error" : undefined}
              className="field"
            />
          </FormField>

          <FormField id="login-password" label="Password" error={formik.touched.password ? formik.errors.password : undefined}>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
              aria-describedby={formik.touched.password && formik.errors.password ? "login-password-error" : undefined}
              className="field"
            />
          </FormField>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="tap mt-1 w-full rounded-xl bg-brand font-semibold text-white transition hover:bg-brand-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {formik.isSubmitting ? "Signing in…" : "Log In"}
          </button>
        </form>
      </div>

      <Link to="/" className="tap inline-flex items-center justify-center rounded-xl text-sm font-semibold text-muted transition hover:text-brand">
        ← Back to catalog
      </Link>
    </div>
  );
}