/*
package uk.ac.bham.teamproject.config;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.testcontainers.containers.JdbcDatabaseContainer;
import org.testcontainers.containers.*;
import org.testcontainers.containers.PostgreSQLContainer;

public interface SqlTestContainer extends InitializingBean, DisposableBean {
    PostgreSQLContainer<?> getTestContainer();
}
*/

package uk.ac.bham.teamproject.config;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.testcontainers.containers.JdbcDatabaseContainer;

public interface SqlTestContainer extends InitializingBean, DisposableBean {
    JdbcDatabaseContainer<?> getTestContainer();
}
